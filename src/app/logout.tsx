"use client";

import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { logout } from "./logout.action";

export function Logout() {
  const router = useRouter();
  const { mutate } = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      router.push("/login");
    },
    onError: (error) => {
      console.error(error);
    },
  });

  return <Button onClick={() => mutate()} className="w-full justify-start p-2" variant="ghost">Logout</Button>;
}
