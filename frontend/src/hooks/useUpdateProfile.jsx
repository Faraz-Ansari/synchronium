import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

export default function useUpdateProfile() {
    const queryClient = useQueryClient();

    const { mutateAsync: updateProfile, isPending: isUpdatePending } = useMutation({
        mutationFn: async (formData) => {
            try {
                const response = await fetch("/api/user/update", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(formData),
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message);
                }

                toast.success("Profile updated successfully");
                await Promise.all([
                    queryClient.invalidateQueries(["authUser"]),
                    queryClient.invalidateQueries(["userProfile"]),
                ]);
                return data;
            } catch (error) {
                console.error(error.message);
                toast.error(error.message);
                throw new Error(error);
            }
        },
    });

    return { updateProfile, isUpdatePending };
}
