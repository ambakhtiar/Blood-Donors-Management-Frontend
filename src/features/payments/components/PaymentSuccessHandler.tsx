"use client";

import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";

interface PaymentSuccessHandlerProps {
  postId?: string;
}

export function PaymentSuccessHandler({ postId }: PaymentSuccessHandlerProps) {
  const queryClient = useQueryClient();

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ["posts"] });
    if (postId) {
      queryClient.invalidateQueries({ queryKey: ["post", postId] });
    }
  }, [queryClient, postId]);

  return null;
}
