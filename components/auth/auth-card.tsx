import { Card, CardContent } from "@/components/ui/card";

export function AuthCard({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Card className="w-full max-w-md">
      <CardContent className="p-6">
        {children}
      </CardContent>
    </Card>
  );
}