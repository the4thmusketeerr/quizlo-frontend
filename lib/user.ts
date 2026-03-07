/**
 * User API Service
 * Handles all API calls for authenticated user account management
 * (e.g., profile, change password, upload picture)
 */

import { getToken } from "@/lib/auth";

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;

// Type definitions
export interface ProfileData {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  profilePicture?: string;
  createdAt?: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface UserResponse {
  success: boolean;
  message?: string;
  data?: ProfileData;
}

/**
 * Fetch current user profile
 */
export async function getProfile(): Promise<UserResponse> {
  try {
    const token = getToken();

    const response = await fetch(`${API_BASE_URL}/user/profile`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to fetch profile.");
    }

    return result;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("An unexpected error occurred while fetching profile.");
  }
}

/**
 * Change password for an authenticated user
 */
export async function changePassword(
  data: ChangePasswordRequest,
): Promise<{ success: boolean; message: string }> {
  try {
    const token = getToken();

    const response = await fetch(`${API_BASE_URL}/user/change-password`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        result.message || "Failed to change password. Please try again.",
      );
    }

    return result;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("An unexpected error occurred while changing password.");
  }
}

/**
 * Upload a profile picture for the authenticated user
 * Sends a PATCH request with FormData (multipart/form-data)
 */
export async function uploadProfilePicture(file: File): Promise<{
  success: boolean;
  message: string;
  data?: { profilePicture: string };
}> {
  try {
    const token = getToken();

    const formData = new FormData();
    formData.append("profilePicture", file);

    const response = await fetch(`${API_BASE_URL}/user/profile-picture`, {
      method: "PATCH",
      headers: {
        // Do NOT set Content-Type — the browser sets it automatically
        // with the correct multipart boundary
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: formData,
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        result.message || "Failed to upload profile picture. Please try again.",
      );
    }

    return result;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error(
      "An unexpected error occurred while uploading profile picture.",
    );
  }
}

export async function deleteProfilePicture(): Promise<{ success: boolean; message: string }> {
  try {
    const token = getToken();

    const response = await fetch(`${API_BASE_URL}/user/profile-picture`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        result.message || "Failed to delete profile picture. Please try again.",
      );
    }

    return result;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error(
      "An unexpected error occurred while deleting profile picture.",
    );
  }
}
