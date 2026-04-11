import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useWorker } from "@/hooks/cron";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_layout/cron-worker")({
  component: RouteComponent,
  head: () => ({
    meta: [
      {
        title: "Cron Worker",
      },
    ],
  }),
});

function RouteComponent() {
  const { data } = useWorker();
  return (
    <>
      <div>Hello "/_layout/cron-worker"!</div>
      <div className="p-4 bg-dot">
        <Card>
          <CardHeader className="flex items-center">
            <img
              className="w-12 rounded-full"
              src="https://ar.4everland.io/_i99TY7tIQP8wy6n2lU2wrddIGoQZiuMkZWdljQ4mIA"
            />
            <span className="text-xl font-semibold">当前运行的节点</span>
          </CardHeader>
          <CardContent className="flex gap-4 flex-wrap">
            {data?.map((item) => (
              <Badge key={item} variant="outline">
                🖥️ {item}
              </Badge>
            ))}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
