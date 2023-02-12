import {useState, useEffect} from 'react'

import { toast} from 'react-hot-toast';
import Select from 'react-select'

import {db} from '../firebaseConfig'
import {collection, getDocs, getDoc, addDoc, updateDoc, doc} from 'firebase/firestore'
import Sectors from './Sectors';

function Form() {
  const dataId = sessionStorage.getItem('dataId')

  // options
  const optionDataRef = collection(db, "OptionData");
  // saved data 
  const organizationDataRef = collection(db, "Organization");

  // State 
  const [formData, setFormData] = useState(
    { 
    name: '', 
    sector: [],
    agreeToTerms: false
  })
  const [options, setOptions] = useState([])  
  const [data, setData] = useState([])

  // const handleInputChange = (name, value) => {
  //   setFormData({
  //     ...formData,
  //     [name]: value
  //   });
  // }
  const handleInputChange = (event) => {

    setFormData({
      ...formData,
      [event.target.name]: event.target.value
    })

  }

  const handleSectorChange = event => {
    const { value } = event.target
    let updatedSectors = [...formData.sector];
    if (updatedSectors.includes(value)) {
      updatedSectors = updatedSectors.filter(item => item !== value);
    } else {
      updatedSectors.push(value);
    }
    setFormData({
      ...formData,
      sector: updatedSectors
    })
  }

  const handleCheckboxChange = (event) => {
    setFormData({
    ...formData,
    [event.target.name]: event.target.checked
    })
    }
  

  // Fetch options
  useEffect(() => {
    const getOptions = async () => {
      const optData = await getDocs(optionDataRef)
      const mapOptData = optData.docs.map((doc) => ({...doc.data(), id: doc.id}))
      setOptions(mapOptData)
    } 
    getOptions()

  },[])
  
  // Fetch Data 
  useEffect(() => {

    const getOrg = async () => {
      const dataId = sessionStorage.getItem('dataId')
      if(dataId) {
        const docRef = doc(db, 'Organization', dataId)
        const orgData = await getDoc(docRef)
        if(orgData.exists()) {
          setData(orgData.data())
          setFormData({...orgData.data(), name: orgData.data().name, sector: orgData.data().sector})
        } else {
          toast.error('Document not found')
        }
      }
    }
    getOrg()

  }, [])


  const handleSubmit = async (e) => {
    e.preventDefault()

    if(!formData) {
      toast.error('all field required')
    }

    const dataId = sessionStorage.getItem('dataId')
    if (dataId) {
      const docRef = doc(db, 'Organization', dataId)
      await updateDoc(docRef, formData)
      getDoc(docRef).then(doc => {
        setData(doc.data())
      })
      toast.success('Updated')
    } else {
      const docRef = await addDoc(organizationDataRef, formData);
      sessionStorage.setItem('dataId', docRef.id)
      getDoc(docRef).then(doc => {
        setData(doc.data())
      })
      toast.success('Saved')
    }
  }


  return (
    <div className="font-manrope mt-12 flex h-screen flex-col gap-14">
      <div className='flex justify-end px-6'>
        {/* <Sectors/> */}
      </div>
      <div className='md:flex items-center justify-center md:px-24'>
        <form onSubmit={handleSubmit}>
          <div className="mx-auto box-border w-[365px] border bg-white p-4">

            <div className="mt-6">
              <div className="font-semibold">Name</div>
              <div>
                <input 
                  className="peer mt-1 w-full rounded-[4px] border bg-gray-50 p-2" 
                  type="text" 
                  placeholder="Name"
                  name='name' 
                  value={formData.name}
                  required
                  onChange={handleInputChange}
                />
                {/* <p className="invisible peer-invalid:visible text-red-700 font-light">
                  Please enter your name
                </p> */}
              </div>
            </div>

            <div className='mt-6'>
              <label htmlFor="countries" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-400">Select an option</label>
              {options.map(option => (
                <div key={option.id}>
                  <input
                    type="checkbox"
                    value={option.name}
                    checked={formData.sector.includes(option.name)}
                    onChange={handleSectorChange}
                  />
                  <span className="ml-2">{option.name}</span>
                </div>
              ))}
              {/* <Select 
                options={options} 
                isMulti
                onChange={handleSelectChange}
                value={formData.sector}
                required
              /> */}

              {/* <select 
                // multiple={true}
                // size='4'
                required
                onChange={handleInputChange}
                value={formData.sector}
                name='sector'
                className="block appearance-none w-full bg-gray-50 border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded leading-tight focus:outline-none focus:shadow-outline"
              >
                {options.map(option => (
                  <option 
                    key={option.id} 
                    value={option.name}
                    required
                  >
                    {option.name}
                  </option>
                ))}
              </select> */}
              {/* <p className="invisible peer-invalid:visible text-red-700 font-light">
                  Please select a sector
              </p> */}
            </div>
            <div className='flex items-center mt-4'>
                <label className="block text-gray-500 font-bold" htmlFor="agreeToTerms">
                  <div className='flex items-center'>
                    <input 
                      className="ml-2 " 
                      type="checkbox" 
                      name="agreeToTerms"
                      checked={formData.agreeToTerms}
                      onChange={handleCheckboxChange} 
                      required
                    />
                    <span className="text-sm">
                        Agree to terms
                    </span>
                  </div>
                </label>
            </div>
            <div className='flex justify-center'>
              <button 
                type='submit' 
                className='mt-2 py-2 px-4 rounded bg-gray-300'
              >
                {dataId ? 'Update' : 'Save'}
                {/* Save */}
              </button>
            </div>
          </div>
        </form>
        <div className="mx-auto box-border w-[365px] border bg-white p-4">
            {/* {data.map(item => (
              <div key={item.id} className='flex mb-2'>
                <div className='flex flex-col '>
                  <div className='md:text-lg text-md'>Name: {item.name}</div>
                  <div className='md:text-lg text-md'>Sector: {item.sector}</div>
                </div>
                </div>
              ))} */}
              <div className='flex flex-col '>
                <div className='md:text-lg text-md'>Name: {data.name}</div>
                {/* <div className='md:text-lg text-md'>Sector: {data.sector}</div> */}
                <h1 className='font-bold'>Sectors</h1>
                {data?.sector?.map((item, i) => (
                  <div key={i}>
                    {item}
                  </div>
                ))}
              </div>
        </div>
      </div>
    </div>
  )
}

export default Form