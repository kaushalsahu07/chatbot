import './App.css'
import BotImg from '../public/image.png'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons'

function App() {

  return (
    <>
    <div className='flex items-center justify-center bg-[#F5F5F5] h-screen'>
       <div className="relative w-[40rem] h-screen md:h-[80%] bg-[#fff] rounded-xl shadow-[0px_0px_50px_-20px_rgba(59,_130,_246,_0.5)]"> 
        {/* Header */}
        <div className='bg-[#4A99E8] flex justify-center h-[80px] rounded-lg p-10'>
          <div className='flex items-center gap-2'> 
           <img className='w-[50px] rounded-full' src={BotImg} alt="Bot" />
            <h1 className='text-white text-2xl font-bold'>ChatBot</h1>
          </div>
        </div>
        {/* Chat Box */}
        <div className=''>

          {/* Chat Messages */}
          <div className='Chat-Dashboard overflow-y-auto flex flex-col gap-4 p-5 '>

            <div className='flex gap-2'>
              <img className='w-[50px] h-[50px] mt-2.5 rounded-full' src={BotImg} alt="Bot" />
              <div className='bg-[#E5E5EA] rounded-tl-[10px] rounded-tr-[10px] rounded-br-[10px] rounded-bl-[0px] p-4 w-[70%]'>
                <p className='text-sm'>Hello! How can I help you today?</p>
              </div>
            </div>

            <div className='flex gap-2 justify-end'>
              <div className='bg-[#4A99E8] text-white rounded-tl-[10px] rounded-tr-[10px] rounded-br-[0px] rounded-bl-[10px] p-4 w-[70%]'>
                <p className='text-sm'>I need help with my order.</p>
              </div>
            </div>

          </div>
          <div className='input-box flex justify-between absolute bottom-0 p-5 w-full'>
            <input type="text" placeholder='Type your message...' className='w-[90%] h-[50px] outline-none border-2 border-[#4A99E8] rounded-full p-7' />
            <div className='flex items-center'>
              <button className='bg-[#4A99E8] text-white w-[50px] h-[50px] rounded-full p-7 flex items-center justify-center'>
                <FontAwesomeIcon className='text-lg' icon={faPaperPlane} />
              </button>
            </div>
          </div>
        </div>
       </div>
    </div>
    </>
  )
}

export default App