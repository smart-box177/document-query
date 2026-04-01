import { useState, useRef } from "react";
import { User, Bell, Shield, Palette, Save, Loader2, Upload, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useAuthStore } from "@/store/auth.store";
import { toast } from "sonner";
import { api } from "@/config/axios";

const Settings = () => {
  const { user, setUser } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [isUploadingSig, setIsUploadingSig] = useState(false);
  const signatureInputRef = useRef<HTMLInputElement>(null);

  // Profile form state
  const [profile, setProfile] = useState({
    username: user?.username || "",
    email: user?.email || "",
    signature: (user as any)?.signature || "",
  });

  const [signatureFile, setSignatureFile] = useState<File | null>(null);
  const [signaturePreview, setSignaturePreview] = useState<string | null>(null);

  // Notification settings
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    searchAlerts: true,
    contractUpdates: true,
    weeklyDigest: false,
  });

  // Privacy settings
  const [privacy, setPrivacy] = useState({
    showProfile: true,
    showActivity: false,
  });

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleSignatureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSignatureFile(file);
      setSignaturePreview(URL.createObjectURL(file));
    }
  };

  const removeBackground = () => {
    if (!signaturePreview) return;
    setIsUploadingSig(true);
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.src = signaturePreview;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) return setIsUploadingSig(false);
      
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      
      const threshold = 200; // Threshold for "white"
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        if (r > threshold && g > threshold && b > threshold) {
          data[i + 3] = 0; // Set alpha to 0 for white pixels
        }
      }
      ctx.putImageData(imageData, 0, 0);
      
      canvas.toBlob((blob) => {
        if (blob) {
          const newFile = new File([blob], "signature_processed.png", { type: "image/png" });
          setSignatureFile(newFile);
          setSignaturePreview(URL.createObjectURL(blob));
        }
        setIsUploadingSig(false);
        toast.success("Background removed!");
      }, "image/png");
    };
    img.onerror = () => {
      setIsUploadingSig(false);
      toast.error("Failed to process image");
    };
  };

  const handleProfileSave = async () => {
    setIsLoading(true);
    try {
      let uploadedSignatureUrl = profile.signature;

      // If user selected a new signature file, upload it first
      if (signatureFile) {
        const formData = new FormData();
        formData.append("file", signatureFile);
        
        const mediaRes = await api.post("/media", formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        if (mediaRes.data.success) {
          uploadedSignatureUrl = mediaRes.data.data.url;
        }
      }

      // Update profile with the new fields
      const res = await api.put("/auth/profile", {
        username: profile.username,
        email: profile.email,
        signature: uploadedSignatureUrl,
      });

      if (res.data.success) {
        setUser(res.data.data);
        setProfile(prev => ({ ...prev, signature: uploadedSignatureUrl }));
        setSignatureFile(null);
        toast.success("Profile updated successfully");
      } else {
        toast.error(res.data.message || "Failed to update profile");
      }
    } catch (error) {
      toast.error("Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  const handleNotificationsSave = async () => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsLoading(false);
    toast.success("Notification preferences saved");
  };

  const handlePrivacySave = async () => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsLoading(false);
    toast.success("Privacy settings updated");
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences
        </p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList>
          <TabsTrigger value="profile" className="gap-2">
            <User className="h-4 w-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2">
            <Bell className="h-4 w-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="privacy" className="gap-2">
            <Shield className="h-4 w-4" />
            Privacy
          </TabsTrigger>
          <TabsTrigger value="appearance" className="gap-2">
            <Palette className="h-4 w-4" />
            Appearance
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Update your personal information and profile picture
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Avatar Section */}
              <div className="flex items-center gap-6">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={user?.avatar} alt={user?.username} />
                  <AvatarFallback className="text-lg">
                    {getInitials(user?.username || "U")}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-2">
                  <Button variant="outline" size="sm">
                    Change Avatar
                  </Button>
                  <p className="text-xs text-muted-foreground">
                    JPG, PNG or GIF. Max size 2MB.
                  </p>
                </div>
              </div>

              <Separator />

              {/* Form Fields */}
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    value={profile.username}
                    onChange={(e) =>
                      setProfile({ ...profile, username: e.target.value })
                    }
                    placeholder="Enter your username"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profile.email}
                    onChange={(e) =>
                      setProfile({ ...profile, email: e.target.value })
                    }
                    placeholder="Enter your email"
                  />
                </div>

                <Separator className="my-2" />

                {/* Signature Section */}
                <div className="grid gap-2">
                  <Label>Digital Signature</Label>
                  <p className="text-sm text-muted-foreground mb-2">
                    Upload your signature to use in applications. You can automatically remove the white background.
                  </p>
                  <div className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center bg-muted/20 hover:bg-muted/40 transition-colors relative group">
                    <input
                      type="file"
                      ref={signatureInputRef}
                      className="hidden"
                      accept="image/png, image/jpeg"
                      onChange={handleSignatureChange}
                    />
                    
                    {(signaturePreview || profile.signature) ? (
                      <div className="flex flex-col items-center w-full">
                        <div className="bg-white/10 dark:bg-black/10 border p-2 rounded-md mb-4 w-full flex justify-center min-h-[100px] overflow-hidden">
                          <img 
                            src={signaturePreview || profile.signature} 
                            alt="Signature" 
                            className="max-h-[150px] object-contain mix-blend-multiply dark:mix-blend-screen"
                          />
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => signatureInputRef.current?.click()}
                          >
                            <Upload className="h-4 w-4 mr-2" /> Change
                          </Button>
                          {signaturePreview && (
                            <Button 
                              variant="secondary" 
                              size="sm" 
                              onClick={removeBackground}
                              disabled={isUploadingSig}
                            >
                              {isUploadingSig ? <Loader2 className="h-4 w-4 animate-spin" /> : "Remove Background"}
                            </Button>
                          )}
                          <Button 
                            variant="destructive" 
                            size="sm" 
                            onClick={() => {
                              setSignaturePreview(null);
                              setSignatureFile(null);
                              setProfile(prev => ({ ...prev, signature: "" }));
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center cursor-pointer py-4 w-full" onClick={() => signatureInputRef.current?.click()}>
                        <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                        <p className="text-sm font-medium">Click to upload signature</p>
                        <p className="text-xs text-muted-foreground mt-1">PNG or JPG (max. 2MB)</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={handleProfileSave} disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Choose how you want to be notified about NCCC updates
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive notifications via email
                    </p>
                  </div>
                  <Switch
                    checked={notifications.emailNotifications}
                    onCheckedChange={(checked) =>
                      setNotifications({ ...notifications, emailNotifications: checked })
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Search Alerts</Label>
                    <p className="text-sm text-muted-foreground">
                      Get notified when new contracts match your saved searches
                    </p>
                  </div>
                  <Switch
                    checked={notifications.searchAlerts}
                    onCheckedChange={(checked) =>
                      setNotifications({ ...notifications, searchAlerts: checked })
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Contract Updates</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive updates about bookmarked contracts
                    </p>
                  </div>
                  <Switch
                    checked={notifications.contractUpdates}
                    onCheckedChange={(checked) =>
                      setNotifications({ ...notifications, contractUpdates: checked })
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Weekly Digest</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive a weekly summary of NCCC contract activity
                    </p>
                  </div>
                  <Switch
                    checked={notifications.weeklyDigest}
                    onCheckedChange={(checked) =>
                      setNotifications({ ...notifications, weeklyDigest: checked })
                    }
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={handleNotificationsSave} disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save Preferences
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Privacy Tab */}
        <TabsContent value="privacy">
          <Card>
            <CardHeader>
              <CardTitle>Privacy Settings</CardTitle>
              <CardDescription>
                Control your privacy and data sharing preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Show Profile</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow other users to see your profile information
                    </p>
                  </div>
                  <Switch
                    checked={privacy.showProfile}
                    onCheckedChange={(checked) =>
                      setPrivacy({ ...privacy, showProfile: checked })
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Show Activity</Label>
                    <p className="text-sm text-muted-foreground">
                      Display your search and bookmark activity
                    </p>
                  </div>
                  <Switch
                    checked={privacy.showActivity}
                    onCheckedChange={(checked) =>
                      setPrivacy({ ...privacy, showActivity: checked })
                    }
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-medium">Danger Zone</h4>
                <div className="flex items-center justify-between p-4 border border-destructive/50 rounded-lg">
                  <div className="space-y-0.5">
                    <Label className="text-destructive">Delete Account</Label>
                    <p className="text-sm text-muted-foreground">
                      Permanently delete your account and all data
                    </p>
                  </div>
                  <Button variant="destructive" size="sm">
                    Delete Account
                  </Button>
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={handlePrivacySave} disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save Settings
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Appearance Tab */}
        <TabsContent value="appearance">
          <Card>
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
              <CardDescription>
                Customize how DocQuery looks for you
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label>Theme</Label>
                  <p className="text-sm text-muted-foreground mb-3">
                    Select your preferred theme. You can also toggle the theme using the switch in the sidebar.
                  </p>
                  <div className="grid grid-cols-3 gap-4">
                    <button className="p-4 border rounded-lg hover:border-primary transition-colors text-center space-y-2">
                      <div className="h-12 w-full bg-white border rounded" />
                      <span className="text-sm">Light</span>
                    </button>
                    <button className="p-4 border rounded-lg hover:border-primary transition-colors text-center space-y-2">
                      <div className="h-12 w-full bg-zinc-900 border rounded" />
                      <span className="text-sm">Dark</span>
                    </button>
                    <button className="p-4 border rounded-lg hover:border-primary transition-colors text-center space-y-2">
                      <div className="h-12 w-full bg-linear-to-r from-white to-zinc-900 border rounded" />
                      <span className="text-sm">System</span>
                    </button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
