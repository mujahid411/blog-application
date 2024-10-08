import React, { useEffect, useState } from 'react'
import { useGlobalContext } from '../GlobalContext'
import axios from 'axios'
import { FaArrowLeft } from 'react-icons/fa';
import toast from 'react-hot-toast';

const MyBlogs = () => {
    let { userId, navigate, base_url } = useGlobalContext();
    let id = userId
    const [blogs, setBlogs] = useState([])

    const getMyBlogs = async () => {
        try {
            let response = await axios.get(`${base_url}/api/user/myBlogs`, {
                params: {
                    id
                }
            }, {
                withCredentials: true
            })
            let allBlogs = response.data;
            console.log(allBlogs)
            setBlogs(allBlogs)
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        if (blogs.length === 0) {
            getMyBlogs()
        }
    }, [blogs])

    const handleDelete = async (blogId) => {
        try {
            await axios.delete(`${base_url}/api/blog/deleteBlog/${blogId}`, {
                withCredentials: true
            });
            toast.success("Blog Deleted")
            getMyBlogs();
        } catch (error) {
            console.error(error);
            toast.error("Blog delete failed")
        }
    }
    if (blogs.length === 0) {
        return (
            <div className='bg-white h-screen text-black'>
                <button
                    className="absolute top-3 left-3 p-3 rounded-full bg-black text-white hover:bg-gray-300 z-50"
                    onClick={() => navigate('/main')}
                >
                    <FaArrowLeft />
                </button>
                <div className="w-full flex justify-center">
                    <h1 className='text-4xl font-bold mt-20'>No Blogs Yet...</h1>
                </div>
            </div>

        )

    }

    return (
        <div className='bg-white h-screen'>
            <button
                className="absolute top-3 left-3 p-3 rounded-full bg-black text-white hover:bg-gray-300 z-50"
                onClick={() => navigate('/main')}
            >
                <FaArrowLeft />
            </button>
            <div className="max-w-screen-xl mx-auto px-4 md:px-8">
                <div className="items-start justify-between md:flex">

                </div>
                <div className="mt-12 shadow-sm border rounded-lg overflow-x-auto">
                    <table className="w-full table-auto text-sm text-left">
                        <thead className="bg-gray-50 text-gray-600 font-medium border-b">
                            <tr>
                                <th className="py-3 px-6">Title</th>

                                <th className="py-3 px-6"></th>

                            </tr>
                        </thead>
                        <tbody className="text-gray-600 divide-y">
                            {blogs.length > 0 &&
                                blogs.map((item, idx) => (
                                    <tr key={idx}>
                                        <td className="px-6 py-4 whitespace-nowrap">{item.title}</td>

                                        <td className="text-right px-6 whitespace-nowrap">
                                            <a href={`/singleblog/${item._id}`} className="py-2 px-3 font-medium text-green-600 hover:text-green-500 duration-150 hover:bg-gray-50 rounded-lg">
                                                View
                                            </a>
                                            <a href={`/editblog/${item._id}`} className="py-2 px-3 font-medium text-indigo-600 hover:text-indigo-500 duration-150 hover:bg-gray-50 rounded-lg">
                                                Edit
                                            </a>
                                            <button onClick={() => handleDelete(item._id)} className="py-2 leading-none px-3 font-medium text-red-600 hover:text-red-500 duration-150 hover:bg-gray-50 rounded-lg">Delete</button>

                                        </td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}


export default MyBlogs