import React from 'react'
import  Link  from 'next/link';
import './styles.css'
function index() {
    // const router = useRouter();
  return (
    
    <div className='h-[100vh] w-full bg-pageBg flex flex-col justify-center' >
    <div className='text-[#333333] justify-center flex  gap-[30px] w-full' >
        <Link href="/App" >
        <button className='p-3 bg-white rounded-lg hover:scale-105  shadow-red-200'>
        Phase 1
    </button>
        </Link>
        <Link href="/LineLiveChart" >
        <button  className='p-3 bg-white rounded-lg hover:scale-105  shadow-red-200'>
        Phase 2
    </button>
        </Link>
    
    <Link href="/CandleLiveChart" >
    <button  className='p-3 bg-white rounded-lg hover:scale-105  shadow-red-200'>
        Phase 3
    </button>
    </Link>
    
    <Link href="/MultipleInstrument" >
    <button className='p-3 bg-white rounded-lg hover:scale-105  shadow-red-200'>
        Phase 4
    </button>
    </Link>
    
</div>
</div>
  )
}

export default index