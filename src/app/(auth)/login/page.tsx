"use client";

import { useState, useRef, KeyboardEvent, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, AlertCircle } from "lucide-react";
import Image from "next/image";
import apiService from "@/services/api";
function LoginPage() {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [verificationId, setVerificationId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const otpRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  const redirectUrl = searchParams.get("redirectUrl") || "/";

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!phone || phone.length !== 10) {
      setError("Please enter a valid 10-digit phone number");
      return;
    }

    try {
      setLoading(true);
      const response = await apiService.identity.requestOtp(phone);
      if (response.successful) {
        setVerificationId(response.data);
        setSuccess("OTP sent successfully! Please check your phone.");
        otpRefs[0].current?.focus();
      } else {
        setError(response.message || "Failed to send OTP");
      }
    } catch (error) {
      setError("Failed to send OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) {
      // If user pastes a number
      const otpArray = value.slice(0, 6).split('');
      const newOtp = [...otp];
      otpArray.forEach((digit, i) => {
        if (i + index < 6) {
          newOtp[i + index] = digit;
        }
      });
      setOtp(newOtp);
      
      // Focus last input or next empty input
      const nextIndex = Math.min(index + otpArray.length, 5);
      otpRefs[nextIndex].current?.focus();
    } else {
      // Single digit input
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Auto focus next input
      if (value && index < 5) {
        otpRefs[index + 1].current?.focus();
      }
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      // Focus previous input on backspace if current input is empty
      otpRefs[index - 1].current?.focus();
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const otpValue = otp.join('');
    if (!otpValue || otpValue.length !== 6) {
      setError("Please enter a valid 6-digit OTP");
      return;
    }

    try {
      setLoading(true);
      const response = await apiService.identity.verifyOtp(verificationId!, otpValue);
      if (response.successful) {
        localStorage.setItem("auth_data", JSON.stringify({
          userId: response.data.userId,
          loginType: response.data.loginType,
          expiry: response.data.expiry
        }));
        router.push(redirectUrl);
      } else {
        setError(response.message || "Invalid OTP");
      }
    } catch (error) {
      setError("Failed to verify OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Image
            src="/faveron.svg"
            alt="Logo"
            width={400}
            height={400}
            className="mx-auto"
          />
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Welcome back
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {verificationId 
              ? "Enter the OTP sent to your phone"
              : "Sign in to your account with phone number"
            }
          </p>
        </div>

        {!verificationId ? (
          <form className="mt-8 space-y-6" onSubmit={handlePhoneSubmit}>
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <div className="mt-1 relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                  +91
                </span>
                <Input
                  id="phone"
                  type="tel"
                  required
                  className="pl-12"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Enter your phone number"
                  pattern="[0-9]{10}"
                  maxLength={10}
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Get OTP
            </Button>

            {error && (
              <div className="bg-destructive/15 text-destructive rounded-md p-3 flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                <p className="text-sm">{error}</p>
              </div>
            )}

            {success && (
              <div className="bg-green-50 text-green-700 rounded-md p-3 flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                <p className="text-sm">{success}</p>
              </div>
            )}
          </form>
        ) : (
          <form className="mt-8 space-y-6" onSubmit={handleOtpSubmit}>
            <div>
              <Label htmlFor="otp">One-Time Password</Label>
              <div className="mt-1 flex gap-2">
                {otp.map((digit, index) => (
                  <Input
                    key={index}
                    ref={otpRefs[index]}
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={6}
                    className="w-12 h-12 text-center text-lg"
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={(e) => {
                      e.preventDefault();
                      const pastedData = e.clipboardData.getData('text');
                      if (/^\d+$/.test(pastedData)) {
                        handleOtpChange(index, pastedData);
                      }
                    }}
                  />
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  setVerificationId(null);
                  setOtp(["", "", "", "", "", ""]);
                  setError(null);
                  setSuccess(null);
                }}
                disabled={loading}
              >
                Change Number
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={handlePhoneSubmit}
                disabled={loading}
              >
                Resend OTP
              </Button>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={loading || otp.some(digit => !digit)}
            >
              {loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Verify & Login
            </Button>

            {error && (
              <div className="bg-destructive/15 text-destructive rounded-md p-3 flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                <p className="text-sm">{error}</p>
              </div>
            )}

            {success && (
              <div className="bg-green-50 text-green-700 rounded-md p-3 flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                <p className="text-sm">{success}</p>
              </div>
            )}
          </form>
        )}
      </div>
    </div>
  );
} 

export default function LoginPageFull() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    }
    >
      <LoginPage />
    </Suspense>
  )
}