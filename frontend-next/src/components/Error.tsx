"use client";
import React from "react";

export default function Error({ error }: { error: string }) {
  return <p className="mt-4 text-red-600 font-semibold text-center">{error}</p>;
}
