package com.nov.eventify.controller;

import com.nov.eventify.dto.EventRequest;
import com.nov.eventify.dto.EventResponse;
import com.nov.eventify.dto.PagedResponse;
import com.nov.eventify.entity.enums.EventCategory;
import com.nov.eventify.entity.enums.EventFormat;
import com.nov.eventify.service.EventService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.UUID;

@RestController
@RequestMapping("/api/events")
@RequiredArgsConstructor
public class EventsController {

    private final EventService eventService;

    @GetMapping
    public PagedResponse<EventResponse> getEvents(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) EventCategory category,
            @RequestParam(required = false) EventFormat format,
            @RequestParam(required = false) LocalDateTime from,
            @RequestParam(required = false) LocalDateTime to,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int pageSize
    ) {
        return eventService.getEvents(search, category, format, from, to, page, pageSize);
    }

    @GetMapping("/{id}")
    public EventResponse getEvent(@RequestParam UUID id) {
        return eventService.getEvent(id);
    }

    @PostMapping
    public EventResponse createEvent(@Valid @RequestBody EventRequest request) {
        return eventService.createEvent(request);
    }

    @PutMapping("/{id}")
    public EventResponse updateEvent(
            @PathVariable UUID id,
            @Valid @RequestBody EventRequest request) {
        return eventService.updateEvent(id, request);
    }

    @DeleteMapping
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteEvent(@PathVariable UUID id){
        eventService.deleteEvent(id);
    }


}
