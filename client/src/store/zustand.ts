import {create} from 'zustand'

interface ContractStore {
    analysisResults:any
    setAnalysisResults: (results:any)=> void;
}

type ModalState = {
    modals:Record<string,boolean>;
    openModal:(key:string) => void;
    closeModal:(key:string) =>void;
    isOpen:(key:string)=>boolean
}

const useContractStore = create<ContractStore>((set)=>({
    analysisResults:undefined,
    setAnalysisResults:(results)=>set({analysisResults:results})
}))

const useModalStore = create<ModalState>((set,get)=>({
    modals:{},
    openModal:(key:string)=>{
        set((state)=>({modals:{...state.modals,[key]:true}}))
    },
    closeModal:(key:string)=>{
        set((state)=>({modals:{...state.modals,[key]:true}}))
    },
    isOpen:(key:string)=>Boolean(get().modals[key])

}))

export {useContractStore,useModalStore}