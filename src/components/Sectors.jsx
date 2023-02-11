import {useEffect, useState} from 'react'


import { toast} from 'react-hot-toast';

import {db} from '../firebaseConfig'
import {collection, getDocs, addDoc, updateDoc, doc} from 'firebase/firestore'


function Sectors() {
    
    const optionDataRef = collection(db, "OptionData");
    // const organizationRef = db.ref("Organization")
    const [formData, setFormData] = useState({
        name: ''
    })
    
    const onSubmit = async (e) => {
        e.preventDefault()
        await addDoc(optionDataRef, {name: formData.name})
        setFormData({name: ''})
        toast.success('sector added')
    } 

    const updateOption = async (id) => {
        const uDoc = doc(db, 'optionData', id)  
        const  newF = {id: id+1}
        await updateDoc(uDoc, newF)
    }

    useEffect(() => {
      const getOption = async () =>{
        const data = await getDocs(optionDataRef)
        console.log(data.docs.map((doc) => ({...doc.data(), id: doc.id})))
      }
      getOption()
    }, [])

  return (
    <div className='flex justify-center items-center'>
        <form onSubmit={onSubmit}>
            <div className="">
                <label
                htmlFor="email"
                className="mb-3 block text-base font-medium text-[#07074D]"
                >
                Add sectors
                </label>
                <input
                type="text"
                id="name"
                value={formData.name}
                onChange={event => setFormData({ ...formData, name: event.target.value })}
                required
                placeholder="sectors"
                className="w-full rounded-md border border-[#e0e0e0] bg-white py-2 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                />
            </div>
            <button type='submit' className='py-2 px-4 rounded mt-2 text-white bg-gray-600'>Add Sectors</button>
        </form>
    </div>
  )
}

export default Sectors