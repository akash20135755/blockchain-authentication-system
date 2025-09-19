"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Shield, Search, CheckCircle, XCircle, Clock, User, Hash } from "lucide-react"

interface ProductData {
  productId: string
  manufacturer: string
  registrationTimestamp: string
  isRegistered: boolean
  isSold: boolean
  currentOwner: string
  isGenuine: boolean
}

interface ApiResponse {
  success: boolean
  message: string
  data?: ProductData
  error?: string
}

export default function ProductAuthPage() {
  const [productId, setProductId] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<ProductData | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleVerify = async () => {
    if (!productId.trim()) {
      setError("Please enter a product ID")
      return
    }

    setIsLoading(true)
    setError(null)
    setResult(null)

    try {
      const response = await fetch(`http://localhost:3001/api/verify/${encodeURIComponent(productId.trim())}`)
      const data: ApiResponse = await response.json()

      if (response.ok && data.success) {
        setResult(data.data!)
      } else {
        setError(data.error || "Product verification failed")
      }
    } catch (err) {
      setError("Network error. Please check if the backend server is running.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleVerify()
    }
  }

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4 pt-8">
          <div className="flex items-center justify-center gap-3">
            <Shield className="h-12 w-12 text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-900">Product Authentication</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Verify the authenticity of your products using blockchain technology. Enter your product's IMEI or serial
            number to check if it's genuine.
          </p>
        </div>

        {/* Verification Form */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Verify Product
            </CardTitle>
            <CardDescription>Enter the IMEI number or serial number found on your product</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="productId">Product ID (IMEI/Serial Number)</Label>
              <Input
                id="productId"
                type="text"
                placeholder="e.g., 123456789012345 or SN-ABC123XYZ"
                value={productId}
                onChange={(e) => setProductId(e.target.value)}
                onKeyPress={handleKeyPress}
                className="text-lg"
              />
            </div>
            <Button onClick={handleVerify} disabled={isLoading || !productId.trim()} className="w-full text-lg py-6">
              {isLoading ? (
                <>
                  <Clock className="mr-2 h-4 w-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                <>
                  <Shield className="mr-2 h-4 w-4" />
                  Verify Product
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
        {result && (
          <Card className="shadow-lg border-green-200 bg-green-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-800">
                <CheckCircle className="h-6 w-6" />
                Genuine Product Verified!
              </CardTitle>
              <CardDescription className="text-green-700">
                This product has been successfully verified on the blockchain
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Product ID</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <Hash className="h-4 w-4 text-gray-500" />
                      <span className="font-mono text-lg">{result.productId}</span>
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-gray-600">Manufacturer</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <User className="h-4 w-4 text-gray-500" />
                      <span className="font-mono text-sm">{formatAddress(result.manufacturer)}</span>
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-gray-600">Current Owner</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <User className="h-4 w-4 text-gray-500" />
                      <span className="font-mono text-sm">{formatAddress(result.currentOwner)}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Registration Date</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <span>{formatDate(result.registrationTimestamp)}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Registered
                    </Badge>
                    {result.isSold && (
                      <Badge variant="outline" className="border-blue-200 text-blue-800">
                        Sold
                      </Badge>
                    )}
                    <Badge variant="default" className="bg-blue-100 text-blue-800">
                      Genuine
                    </Badge>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="bg-white p-4 rounded-lg border">
                <h4 className="font-semibold text-green-800 mb-2">Verification Summary</h4>
                <p className="text-sm text-gray-700">
                  This product has been successfully verified against the blockchain registry. The product ID{" "}
                  <span className="font-mono bg-gray-100 px-1 rounded">{result.productId}</span> is registered and
                  authentic. You can trust that this is a genuine product from the verified manufacturer.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Information Section */}
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-blue-800">How It Works</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-blue-700">
            <div className="flex items-start gap-3">
              <div className="bg-blue-200 rounded-full p-1 mt-0.5">
                <span className="text-xs font-bold text-blue-800 block w-5 h-5 flex items-center justify-center">
                  1
                </span>
              </div>
              <p>Manufacturers register each genuine product on the blockchain during production</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="bg-blue-200 rounded-full p-1 mt-0.5">
                <span className="text-xs font-bold text-blue-800 block w-5 h-5 flex items-center justify-center">
                  2
                </span>
              </div>
              <p>Each product gets a unique identifier (IMEI/Serial Number) stored immutably</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="bg-blue-200 rounded-full p-1 mt-0.5">
                <span className="text-xs font-bold text-blue-800 block w-5 h-5 flex items-center justify-center">
                  3
                </span>
              </div>
              <p>Customers can verify authenticity by checking the blockchain registry</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
