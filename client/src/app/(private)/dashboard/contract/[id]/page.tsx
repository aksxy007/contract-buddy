import React from 'react'
import ContractResults from './_components/contract-results'

interface IContractResultsProps{
    params:{id:string}
}

const ContractPage = ({params:{id}}:IContractResultsProps) => {
  return (
    <ContractResults contractId={id}/>
  )
}

export default ContractPage