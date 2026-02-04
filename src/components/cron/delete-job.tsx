import { toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";
import { useSnapshot } from "valtio";
import { http } from "../../utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { Button } from "../ui/button";
import { ReactSVG } from "react-svg";
import { ICON_SRC } from "@/consts";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { storePersist } from "@/lib/valtio";

export function DeleteJob({ name }: { name?: string }) {
  const queryClient = useQueryClient();
  const { cronURL } = useSnapshot(storePersist);
  return (
    <>
      <AlertDialog>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <AlertDialogTrigger asChild>
                <Button size="icon" variant="ghost" className="cursor-pointer">
                  <ReactSVG
                    src={ICON_SRC["delete"]}
                    className="text-rose-400 w-6"
                  />
                </Button>
              </AlertDialogTrigger>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p>delete {name} job</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <AlertDialogContent
          className="sm:max-w-md"
          onCloseAutoFocus={(e) => e.preventDefault()}
        >
          <AlertDialogHeader>
            <AlertDialogTitle>确定删除Job?</AlertDialogTitle>
            <AlertDialogDescription>
              此操作无法撤消,将永久删除Job
              {`${name ? `:“${name}”` : ""}`}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction
              className="bg-warning text-warning-foreground hover:bg-destructive"
              onClick={() => {
                if (name) {
                  http(`${cronURL}/api/v1/etcd`, {
                    method: "delete",
                    params: {
                      key: `/cron/jobs/${name}`,
                      prefix: false,
                    },
                  }).then(() => {
                    queryClient
                      .invalidateQueries({
                        queryKey: ["cron-job"],
                      })
                      .then();
                    toast.success("Job deleted successfully.");
                  });
                }
              }}
            >
              删除
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
