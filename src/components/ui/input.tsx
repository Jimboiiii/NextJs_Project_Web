import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "block w-full p-2.5 text-sm text-black placeholder-450 bg-transparent border-2 border-gray-300 focus:ring-blue-500 focus:border-blue-500  rounded-md",
        className
      )}
      {...props}
    />
  )
}

export { Input }
