import {  LockIcon } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import Link from "next/link";
import { useModalStore } from "@/store/zustand";

export default function AuthCard() {
    const { openModal } = useModalStore();
  
    return (
      <Card className="w-full max-w-3xl mx-auto">
        <div className="flex flex-col sm:flex-row">
          <div className="sm:w-1/4 bg-primary/10 flex items-center justify-center p-4">
            <LockIcon className="size-16 text-primary" />
          </div>
          <div className="sm:w-3/4 p-4">
            <CardHeader className="space-y-1 px-0 pb-2">
              <CardTitle className="text-2xl font-bold">
                Authentication required
              </CardTitle>
              <CardDescription>
                You need to be logged in to access this page.
              </CardDescription>
            </CardHeader>
            <CardContent className="px-0 py-2">
              <div className="flex flex-col sm:flex-row gap-2">
                <Button
                  onClick={() => openModal("connectAccountModal")}
                  className="flex-1"
                  
                >
                  Continue with Google
                </Button>
                
                <Button asChild variant={"outline"} className="w-full">
                    <Link href={"/"} className="flex-1">Back to Home</Link>
                </Button>
              </div>
            </CardContent>
          </div>
        </div>
      </Card>
    );
  }