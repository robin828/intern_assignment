import React from 'react'
import { useRouter } from 'next/router';
import './styles.css'
function index() {
    const router = useRouter();
  return (
    
    <div className='h-[100vh] w-full bg-pageBg flex flex-col justify-center' >
    <div className='text-[#333333] justify-center flex  gap-[30px] w-full' >
    <button onClick={()=>router.push('/App')} className='p-3 bg-white rounded-lg hover:scale-105  shadow-red-200'>
        Phase 1
    </button>
    <button onClick={()=>router.push('/LineLiveChart')} className='p-3 bg-white rounded-lg hover:scale-105  shadow-red-200'>
        Phase 2
    </button>
    <button onClick={()=>router.push('/CandleLiveChart')} className='p-3 bg-white rounded-lg hover:scale-105  shadow-red-200'>
        Phase 3
    </button>
    <button onClick={()=>router.push('/MultipleInstrument')} className='p-3 bg-white rounded-lg hover:scale-105  shadow-red-200'>
        Phase 4
    </button>
</div>
</div>
  )
}

export default index