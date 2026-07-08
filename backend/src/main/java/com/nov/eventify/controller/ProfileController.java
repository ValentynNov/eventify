package com.nov.eventify.controller;


import com.nov.eventify.dto.AvatarResponse;
import com.nov.eventify.dto.UpdateAvatarRequest;
import com.nov.eventify.dto.UserProfileResponse;
import com.nov.eventify.security.FirebasePrincipal;
import com.nov.eventify.service.ProfileService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profile")
@RequiredArgsConstructor
public class ProfileController {

    private final ProfileService profileService;

    @GetMapping("/me")
    public UserProfileResponse getMyProfile(@AuthenticationPrincipal FirebasePrincipal principal){
        return profileService.getMyProfile(principal);
    }

    @PatchMapping("/me/avatar")
    public AvatarResponse updateMyAvatar(
            @AuthenticationPrincipal FirebasePrincipal principal,
            @Valid @RequestBody UpdateAvatarRequest request
            ){
        return profileService.updateMyAvatar(principal, request);
    }
}
