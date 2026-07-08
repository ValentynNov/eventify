package com.nov.eventify.service;

import com.nov.eventify.dto.EventRequest;
import com.nov.eventify.dto.EventResponse;
import com.nov.eventify.dto.PagedResponse;
import com.nov.eventify.entity.Event;
import com.nov.eventify.entity.enums.EventCategory;
import com.nov.eventify.entity.enums.EventFormat;
import com.nov.eventify.entity.enums.RegistrationStatus;
import com.nov.eventify.repository.EventRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class EventService {

    private final EventRepository eventRepository;


    public PagedResponse<EventResponse> getEvents(String search, EventCategory category, EventFormat format,
                                                  LocalDateTime from, LocalDateTime to,
                                                  int page, int pageSize) {

        Pageable pageable = PageRequest.of(page, pageSize, Sort.by("eventDate").ascending());

        Specification<Event> spec = Specification.<Event>unrestricted();
        spec = andIfPresent(spec, searchSpec(search));
        spec = andIfPresent(spec, categorySpec(category));
        spec = andIfPresent(spec, formatSpec(format));
        spec = andIfPresent(spec, fromSpec(from));
        spec = andIfPresent(spec, toSpec(to));

        Page<Event> events = eventRepository.findAll(spec, pageable);

        return new PagedResponse<>(
                events.getContent().stream().map(this::toResponse).toList(),
                events.getNumber(),
                events.getSize(),
                events.getTotalElements(),
                events.getTotalPages(),
                events.hasNext(),
                events.hasPrevious()
        );
    }

    public EventResponse getEvent(UUID id) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("event not found"));

        return toResponse(event);
    }

    public EventResponse createEvent(EventRequest eventRequest) {
        Event event = new Event();

        applyRequest(event, eventRequest);

        return toResponse(eventRepository.save(event));
    }

    public EventResponse updateEvent(UUID id, EventRequest request) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("event not found"));

        applyRequest(event, request);

        return toResponse(eventRepository.save(event));

    }


    private EventResponse toResponse(Event event) {
        return new EventResponse(
                event.getId(),
                event.getTitle(),
                event.getDescription(),
                event.getCategory(),
                event.getFormat(),
                event.getLocation(),
                event.getCapacity(),
                event.getEventDate(),
                event.getCreatedAt(),
                countApprovedRegistrations(event)
        );
    }

    private long countApprovedRegistrations(Event event) {
        return event.getRegistrations().stream()
                .filter(registration -> registration.getStatus() == RegistrationStatus.APPROVED)
                .count();
    }

    private void applyRequest(Event event, EventRequest request) {
        event.setTitle(request.title().trim());
        event.setDescription(request.description().trim());
        event.setCategory(request.category());
        event.setFormat(request.format());
        event.setLocation(request.location().trim());
        event.setCapacity(request.capacity());
        event.setEventDate(request.eventDate());
    }

    private Specification<Event> searchSpec(String search) {
        if (search == null || search.isBlank()) {
            return null;
        }
        String pattern = "%" + search.trim().toLowerCase() + "%";

        return ((root, query, cb) -> cb.or(
                cb.like(cb.lower(root.get("title")), pattern),
                cb.like(cb.lower(root.get("description")), pattern),
                cb.like(cb.lower(root.get("location")), pattern)
        ));
    }

    private Specification<Event> andIfPresent(
            Specification<Event> base,
            Specification<Event> next
    ) {
        return next == null ? base : base.and(next);
    }


    private Specification<Event> categorySpec(EventCategory category) {
        if (category == null) {
            return null;
        }
        return (root, query, criteriaBuilder) ->
                criteriaBuilder.equal(root.get("category"), category);
    }


    private Specification<Event> formatSpec(EventFormat format) {
        if (format == null) {
            return null;
        }
        return (root, query, criteriaBuilder) ->
                criteriaBuilder.equal(root.get("format"), format);
    }

    private Specification<Event> fromSpec(LocalDateTime from) {
        if (from == null) {
            return null;
        }
        return (root, query, criteriaBuilder) ->
                criteriaBuilder.greaterThanOrEqualTo(root.get("eventDate"), from);
    }

    private Specification<Event> toSpec(LocalDateTime to) {
        if (to == null) {
            return null;
        }
        return (root, query, criteriaBuilder) ->
                criteriaBuilder.lessThanOrEqualTo(root.get("eventDate"), to);
    }

    public void deleteEvent(UUID id) {
        if (!eventRepository.existsById(id)) {
            throw new RuntimeException("event not found");
        }
        eventRepository.deleteById(id);
    }
}
