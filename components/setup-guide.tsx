import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ExternalLink, Key, Database, Shield } from "lucide-react"

export default function SetupGuide() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Setup Your Authentication System</h1>
          <p className="text-xl text-gray-600">Follow these steps to configure Clerk and Supabase</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Clerk Setup */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-blue-600" />
                Clerk Authentication Setup
              </CardTitle>
              <CardDescription>Configure user authentication with Google OAuth</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className="w-6 h-6 rounded-full p-0 flex items-center justify-center text-xs"
                  >
                    1
                  </Badge>
                  <span className="text-sm">
                    Create account at{" "}
                    <a
                      href="https://clerk.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline inline-flex items-center gap-1"
                    >
                      clerk.com <ExternalLink className="h-3 w-3" />
                    </a>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className="w-6 h-6 rounded-full p-0 flex items-center justify-center text-xs"
                  >
                    2
                  </Badge>
                  <span className="text-sm">Create a new application</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className="w-6 h-6 rounded-full p-0 flex items-center justify-center text-xs"
                  >
                    3
                  </Badge>
                  <span className="text-sm">Enable Google OAuth in Social Connections</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className="w-6 h-6 rounded-full p-0 flex items-center justify-center text-xs"
                  >
                    4
                  </Badge>
                  <span className="text-sm">Copy API keys from the dashboard</span>
                </div>
              </div>

              <Separator />

              <div className="bg-gray-50 rounded-lg p-3">
                <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                  <Key className="h-4 w-4" />
                  Environment Variables:
                </h4>
                <div className="space-y-1 text-xs font-mono">
                  <div>NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...</div>
                  <div>CLERK_SECRET_KEY=sk_test_...</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Supabase Setup */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5 text-green-600" />
                Supabase Database Setup
              </CardTitle>
              <CardDescription>Configure your PostgreSQL database</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className="w-6 h-6 rounded-full p-0 flex items-center justify-center text-xs"
                  >
                    1
                  </Badge>
                  <span className="text-sm">
                    Create project at{" "}
                    <a
                      href="https://supabase.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-green-600 hover:underline inline-flex items-center gap-1"
                    >
                      supabase.com <ExternalLink className="h-3 w-3" />
                    </a>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className="w-6 h-6 rounded-full p-0 flex items-center justify-center text-xs"
                  >
                    2
                  </Badge>
                  <span className="text-sm">Get your project URL and anon key</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className="w-6 h-6 rounded-full p-0 flex items-center justify-center text-xs"
                  >
                    3
                  </Badge>
                  <span className="text-sm">Run the provided SQL scripts</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className="w-6 h-6 rounded-full p-0 flex items-center justify-center text-xs"
                  >
                    4
                  </Badge>
                  <span className="text-sm">Update your environment variables</span>
                </div>
              </div>

              <Separator />

              <div className="bg-gray-50 rounded-lg p-3">
                <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                  <Key className="h-4 w-4" />
                  Environment Variables:
                </h4>
                <div className="space-y-1 text-xs font-mono">
                  <div>NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co</div>
                  <div>NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Final Steps */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Final Steps</CardTitle>
            <CardDescription>Complete the setup process</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-2 text-sm font-bold">
                  1
                </div>
                <h4 className="font-semibold mb-1">Update .env.local</h4>
                <p className="text-sm text-gray-600">Add your real API keys to the environment file</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center mx-auto mb-2 text-sm font-bold">
                  2
                </div>
                <h4 className="font-semibold mb-1">Run SQL Scripts</h4>
                <p className="text-sm text-gray-600">Execute the database setup scripts in Supabase</p>
              </div>
              <div className="text-center p-4 bg-cyan-50 rounded-lg">
                <div className="w-8 h-8 bg-cyan-600 text-white rounded-full flex items-center justify-center mx-auto mb-2 text-sm font-bold">
                  3
                </div>
                <h4 className="font-semibold mb-1">Restart Server</h4>
                <p className="text-sm text-gray-600">Restart your development server to apply changes</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sample .env.local */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Sample .env.local File</CardTitle>
            <CardDescription>Copy this template and replace with your actual values</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-900 text-gray-100 rounded-lg p-4 font-mono text-sm overflow-x-auto">
              <div className="text-green-400"># Clerk Configuration</div>
              <div>NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_actual_key_here</div>
              <div>CLERK_SECRET_KEY=sk_test_your_actual_secret_here</div>
              <div className="mt-2 text-green-400"># Supabase Configuration</div>
              <div>NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co</div>
              <div>NEXT_PUBLIC_SUPABASE_ANON_KEY=your_actual_anon_key_here</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
