import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getCurrentUser } from "@/lib/actions/user.actions";

export default async function FarmerProfilePage() {
  const user = await getCurrentUser();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Farmer Profile</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" defaultValue={user?.name || ""} disabled />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" defaultValue={user?.email || ""} disabled />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Farm Address</Label>
            <Input id="address" defaultValue={user?.address || ""} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Bank Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="accountName">Account Name</Label>
            <Input
              id="accountName"
              defaultValue={user?.bankDetails?.accountName || ""}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="accountNumber">Account Number</Label>
            <Input
              id="accountNumber"
              defaultValue={user?.bankDetails?.accountNumber || ""}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bankName">Bank Name</Label>
            <Input
              id="bankName"
              defaultValue={user?.bankDetails?.bankName || ""}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="branch">Branch (Optional)</Label>
            <Input id="branch" defaultValue={user?.bankDetails?.branch || ""} />
          </div>

          <Button className="mt-4">Update Profile</Button>
        </CardContent>
      </Card>
    </div>
  );
}
