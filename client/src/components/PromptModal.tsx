import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";
import { Button } from "./ui/button";
import { ShieldAlertIcon, ShieldQuestionIcon, SkullIcon } from "lucide-react";

export const PromptModal = ({
  triggerText,
  dialogTitle,
  prompType,
  dialogMessage,
  callback,
  nonButton,
}: {
  triggerText?: string;
  prompType?: "ADD" | "UPDATE" | "DELETE" | "TOGGLE";
  dialogTitle?: string;
  dialogMessage?: string;
  callback: Function;
  nonButton?: boolean;
}) => {
  const [open, setOpen] = useState<boolean>(false);

  if (nonButton)
    return (
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{dialogTitle}</AlertDialogTitle>
          <AlertDialogDescription>{dialogMessage}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction onClick={() => callback()}>
            Continue{" "}
            {prompType === "ADD" ? (
              <ShieldQuestionIcon />
            ) : prompType === "UPDATE" ? (
              <ShieldAlertIcon />
            ) : prompType === "DELETE" ? (
              <SkullIcon />
            ) : prompType === "TOGGLE" ? (
              <SkullIcon />
            ) : null}
          </AlertDialogAction>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    );

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <Button
        className="flex gap-2"
        onClick={() => {
          setOpen(true);
        }}
      >
        {triggerText}
        {prompType === "ADD" ? (
          <ShieldQuestionIcon />
        ) : prompType === "UPDATE" ? (
          <ShieldAlertIcon />
        ) : prompType === "DELETE" ? (
          <SkullIcon />
        ) : prompType === "TOGGLE" ? (
          <SkullIcon />
        ) : null}
      </Button>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{dialogTitle}</AlertDialogTitle>
          <AlertDialogDescription>{dialogMessage}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction onClick={() => callback()}>
            Continue{" "}
            {prompType === "ADD" ? (
              <ShieldQuestionIcon />
            ) : prompType === "UPDATE" ? (
              <ShieldAlertIcon />
            ) : prompType === "DELETE" ? (
              <SkullIcon />
            ) : prompType === "TOGGLE" ? (
              <SkullIcon />
            ) : null}
          </AlertDialogAction>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
