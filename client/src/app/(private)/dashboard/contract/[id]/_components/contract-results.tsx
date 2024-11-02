"use client"

import ContractAnalysisResutls from "@/components/analysis/contract-analysis-results";
import { useCurrentUser } from "@/hooks/use-currentuser"
import { useSubscription } from "@/hooks/use-subscription";
import { ContractAnalysis } from "@/interfaces/contract.interface";
import { api } from "@/lib/api";
import stripePromise from "@/lib/stripe";
import { notFound } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface IContractResultsProps{
    contractId:string,
}

export default function ContractResults({contractId}:IContractResultsProps){
    const {user} = useCurrentUser();
    const [analysisResults,setAnalysisResults] = useState<ContractAnalysis| null>(null);
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<boolean>(false)
    
    const fetchAnalysisResults = async (id:string)=>{
        try {
            setLoading(true)
            const response = await api.get(`/contracts/contract/${id}`)
            console.log(response.data)
            setAnalysisResults(response.data)
            setError(false)
        } catch (error) {
            console.error(error)
            setError(true)
        }finally{
            setLoading(false)
        }
    }
    
    if(error){
        return notFound()
    }

    useEffect(() => {
        if(user)
            fetchAnalysisResults(contractId)
    }, [user])

    const { subscriptionStatus,
        isSubscriptionLoading,
        isSubscriptionError} = useSubscription()
    
      if(!subscriptionStatus){
        return <div>Loading...</div>
      }
    
      const isActive = subscriptionStatus.status === "active"
    const handleUpgrade  = async ()=>{
        setLoading(true)
        if(!isActive){
        try {
            const response = await api.get("/payments/create-checkout-session")
            const stripe = await stripePromise;
            await stripe?.redirectToCheckout({
              sessionId:response.data.sessionId
            })
        } catch (error) {
          console.error(error)
          toast.error("Please try again or login to your account")
        }
        finally{
          setLoading(false)
        }
        }
        else{
          toast.error("You are already a premium")
        }
      }
    
    
    return(
        <ContractAnalysisResutls contractId={contractId} analysisResults={analysisResults} isActive={isActive} onUpgrade={handleUpgrade}/>
    )
}