import { useMutation } from "@tanstack/react-query";
import {
  getAuth,
  updateProfile,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from "firebase/auth";
import app from "../firebase/firebase.init";

const auth = getAuth(app);

export const useUpdateProfile = () =>
  useMutation({
    mutationFn: async ({ displayName, photoURL }) => {
      await updateProfile(auth.currentUser, { displayName, photoURL });
    },
  });

export const useUploadPhoto = () =>
  useMutation({
    mutationFn: async (imageFile) => {
      const formData = new FormData();
      formData.append("image", imageFile);
      const res = await fetch(
        `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMGBB_API_KEY}`,
        { method: "POST", body: formData }
      );
      const data = await res.json();
      if (!data.success) throw new Error("Image upload failed");
      return data.data.display_url;
    },
  });

export const useChangePassword = () =>
  useMutation({
    mutationFn: async ({ currentPassword, newPassword }) => {
      const user = auth.currentUser;
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, newPassword);
    },
  });