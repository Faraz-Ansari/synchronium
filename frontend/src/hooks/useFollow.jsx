import { toast } from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function useFollow() {
    const queryClient = useQueryClient();

    const { mutate: toggleFollow, isPending } = useMutation({
        mutationFn: async (userId) => {
            try {
                const response = await fetch(
                    `/api/user/toggle-follow/${userId}`,
                    {
                        method: "POST",
                    }
                );

                const data = await response.json();
                if (!response.ok) {
                    throw new Error(data.message);
                }
                toast.success(`followed successfully`);
                await Promise.all([
                    queryClient.invalidateQueries({
                        queryKey: ["suggestedUsers"],
                    }),
                    queryClient.invalidateQueries({ queryKey: ["authUser"] }),
                ]);

                return data;
            } catch (error) {
                toast.error(error.message);
                console.error(error.message);
                throw new Error(error);
            }
        },
    });

    return { toggleFollow, isPending };
}
