"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Package, CheckCircle, XCircle, Clock, Hash } from "lucide-react"

interface RegistrationResponse {
  success: boolean
  message: string
  data?: {
    productId: string
    transactionHash: string
    blockNumber: number
    timestamp: string
  }
  error?: string
}

export default function ManufacturerDashboard() {
  const [productId, setProductId] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [registrationResult, setRegistrationResult] = useState<RegistrationResponse | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleRegister = async () => {
    if (!productId.trim()) {
      setError("Please enter a product ID")
      return
    }

    setIsLoading(true)
    setError(null)
    setRegistrationResult(null)

    try {
      const response = await fetch("http://localhost:3001/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ productId: productId.trim() }),
      })

      const data: RegistrationResponse = await response.json()

      if (response.ok && data.success) {
        setRegistrationResult(data)
        setProductId("") // Clear input on success
      } else {
        setError(data.error || "Product registration failed")
      }
    } catch (err) {
      setError("Network error. Please check if the backend server is running.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleRegister()
    }
  }

  const generateSampleId = () => {
    const timestamp = Date.now().toString().slice(-8)
    const random = Math.random().toString(36).substring(2, 8).toUpperCase()
    setProductId(`IMEI-${timestamp}${random}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 p-4">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4 pt-8">
          <div className="flex items-center justify-center gap-3">
            <Package className="h-12 w-12 text-purple-600" />
            <h1 className="text-4xl font-bold text-gray-900">Manufacturer Dashboard</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Register your products on the blockchain to enable authenticity verification for customers.
          </p>
        </div>

        <Tabs defaultValue="register" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="register">Register Product</TabsTrigger>
            <TabsTrigger value="manage">Manage Products</TabsTrigger>
          </TabsList>

          <TabsContent value="register" className="space-y-6">
            {/* Registration Form */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  Register New Product
                </CardTitle>
                <CardDescription>
                  Add a new product to the blockchain registry with its unique identifier
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="productId">Product ID (IMEI/Serial Number)</Label>
                  <div className="flex gap-2">
                    <Input
                      id="productId"
                      type="text"
                      placeholder="e.g., IMEI-123456789012345"
                      value={productId}
                      onChange={(e) => setProductId(e.target.value)}
                      onKeyPress={handleKeyPress}
                      className="text-lg"
                    />
                    <Button variant="outline" onClick={generateSampleId} className="whitespace-nowrap bg-transparent">
                      Generate Sample
                    </Button>
                  </div>
                </div>
                <Button
                  onClick={handleRegister}
                  disabled={isLoading || !productId.trim()}
                  className="w-full text-lg py-6"
                >
                  {isLoading ? (
                    <>
                      <Clock className="mr-2 h-4 w-4 animate-spin" />
                      Registering...
                    </>
                  ) : (
                    <>
                      <Plus className="mr-2 h-4 w-4" />
                      Register Product
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Error Display */}
            {error && (
              <Alert variant="destructive">
                <XCircle className="h-4 w-4" />
                <AlertDescription className="text-lg">{error}</AlertDescription>
              </Alert>
            )}

            {/* Success Result */}
            {registrationResult && registrationResult.success && (
              <Card className="shadow-lg border-green-200 bg-green-50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-green-800">
                    <CheckCircle className="h-6 w-6" />
                    Product Registered Successfully!
                  </CardTitle>
                  <CardDescription className="text-green-700">
                    Your product has been added to the blockchain registry
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Product ID</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <Hash className="h-4 w-4 text-gray-500" />
                        <span className="font-mono text-lg">{registrationResult.data?.productId}</span>
                      </div>
                    </div>

                    <div>
                      <Label className="text-sm font-medium text-gray-600">Block Number</Label>
                      <div className="mt-1">
                        <Badge variant="secondary">#{registrationResult.data?.blockNumber}</Badge>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-gray-600">Transaction Hash</Label>
                    <div className="mt-1 p-2 bg-gray-100 rounded font-mono text-sm break-all">
                      {registrationResult.data?.transactionHash}
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-lg border">
                    <h4 className="font-semibold text-green-800 mb-2">Next Steps</h4>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• Share the Product ID with your customers</li>
                      <li>• Include verification instructions with the product</li>
                      <li>• Customers can verify authenticity using the verification portal</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="manage" className="space-y-6">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Product Management</CardTitle>
                <CardDescription>View and manage your registered products</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-500">
                  <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Product management features coming soon...</p>
                  <p className="text-sm">This will include product listing, transfer ownership, and analytics.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Information Section */}
        <Card className="bg-purple-50 border-purple-200">
          <CardHeader>
            <CardTitle className="text-purple-800">Registration Guidelines</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-purple-700">
            <div className="flex items-start gap-3">
              <div className="bg-purple-200 rounded-full p-1 mt-0.5">
                <span className="text-xs font-bold text-purple-800 block w-5 h-5 flex items-center justify-center">
                  1
                </span>
              </div>
              <p>Use unique identifiers like IMEI numbers or serial numbers for each product</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="bg-purple-200 rounded-full p-1 mt-0.5">
                <span className="text-xs font-bold text-purple-800 block w-5 h-5 flex items-center justify-center">
                  2
                </span>
              </div>
              <p>Register products before they leave your manufacturing facility</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="bg-purple-200 rounded-full p-1 mt-0.5">
                <span className="text-xs font-bold text-purple-800 block w-5 h-5 flex items-center justify-center">
                  3
                </span>
              </div>
              <p>Provide verification instructions to customers with each product</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
