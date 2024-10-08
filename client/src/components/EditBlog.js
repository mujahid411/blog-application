import React, { useRef, useState, useEffect } from 'react';
import JoditEditor from 'jodit-react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { useGlobalContext } from '../GlobalContext';
import { FaArrowLeft } from 'react-icons/fa';
import toast from 'react-hot-toast';

const EditBlog = () => {
    const { user, userId, navigate, base_url } = useGlobalContext()
    const { id } = useParams()
    const userName = user.name
    const editor = useRef(null);
    const [content, setContent] = useState('');
    const [title, setTitle] = useState('');
    const [image, setImage] = useState(null);
    const [imageValue, setImageValue] = useState(false);
    const [imageUrl, setImageUrl] = useState(null);
    const [blogContent, setBlogContent] = useState('');
    const [data, setData] = useState({});


    let fetchBlog = async () => {
        try {
            let response = await axios.get(`${base_url}/api/blog/singleBlog`, {
                params: {
                    id
                }
            }, {
                withCredentials: true
            });
            let blogData = response.data
            console.log("blog data", blogData)
            setData(blogData);
            setContent(blogData.blogContent);
            setTitle(blogData.title);
            setImageUrl(blogData.imageUrl)
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        if (title === '') {
            fetchBlog();
        }
    }, [title]);



    const updateBlogContent = async () => {
        try {
            var tempDiv = document.createElement("div");
            tempDiv.innerHTML = content;
            setBlogContent(tempDiv.innerText);
        } catch (error) {
            console.error(error);
        }
    };
    useEffect(() => {
        updateBlogContent();
    }, [content]);

    const handleSubmit = async (e) => {
        try {
            e.preventDefault();

            await updateBlogContent();

            if (blogContent.length > 0 && imageUrl && title) {
                // https://algohire-blog-server.vercel.app
                let response = await axios.put(`${base_url}/api/blog/updateBlog/${data._id}`, { blogContent, imageUrl, title, userId, userName }, {
                    withCredentials: true
                });
                if (response) {
                    toast.success("Blog Updated Successfully!")
                    navigate('/main');
                }
            }
        } catch (error) {
            console.error(error);
            toast.error("Update failed, please try again")
        }
    };

    const uploadFile = async (type, data) => {
        try {
            let cloudName = 'drgqcwxq6';
            let resourceType = type === 'image' ? 'image' : 'video';
            let api = `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`;

            const res = await axios.post(api, data);
            const { secure_url } = res.data;

            if (resourceType === 'image') {
                setImageValue(false);
                setImageUrl(secure_url);
            }

            return secure_url;
        } catch (error) {
            console.error(error);
        }
    };

    const handleImageUpload = async (e) => {
        try {
            setImageValue(true);
            const newData = new FormData();
            newData.append('file', e.target.files[0]);
            newData.append('upload_preset', 'images_preset');

            setImage(e.target.files[0]);

            const imageUrl = await uploadFile('image', newData);
            console.log(imageUrl);
            setImageUrl(imageUrl);
        } catch (error) {
            console.error(error);
        }
    };

    // const handleClick = async (e) => {
    //     e.preventDefault()
    //     if (title.length < 0) {
    //         return;
    //     }

    //     // console.log(title)
    //     try {
    //         let response = await axios.get('https://algohire-blog-server.vercel.app/api/blog/ai-blog', {
    //             params: { title: title }
    //         });
    //         let newContent = response.data.blog
    //         setContent(newContent)
    //     } catch (error) {
    //         console.error(error)
    //     }
    // }
    return (
        <div className='bg-white h-screen'>
            {/* <NavBar /> */}
            <button
                className="absolute top-3 left-3 p-3 rounded-full bg-black text-white hover:bg-gray-300 z-50"
                onClick={() => navigate('/main')}
            >
                <FaArrowLeft />
            </button>
            <div className="w-full relative z-10 text-gray-600 ">
                <center className="text-2xl font-bold ">Edit Blog</center>
                <div className="w-full mt-0 mx-auto p-8 bg-white max-w-full md:max-w-lg sm:px-0 sm:rounded-xl ">
                    <form onSubmit={handleSubmit} className=" w-full space-y-3 mr-10 w-full">
                        <div>
                            <label className="font-medium">Title</label>
                            <input
                                type="text"
                                required
                                className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-gray-800 shadow-sm rounded-lg"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                        </div>

                        <div>
                            <label className="font-medium">Image</label>
                            <input
                                id="courseImage"
                                name="courseImage"
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                className="file-input w-full h-11 rounded border-1 text-gray-900 placeholder:text-gray-400 focus:ring-1 focus:ring-black-600 text-sm mt-2 file:bg-black-600"
                                style={{ border: '1px solid grey', marginBottom: '0' }}
                            />
                        </div>
                        {imageUrl && <img src={imageUrl} className='w-full' />}
                        {/* <button
                    onClick={handleClick}
                    className="w-full px-4 py-2 text-white font-medium bg-gray-800 hover:bg-gray-700 active:bg-gray-900 rounded-lg duration-150"
                    >
                    Generate AI Blog
                </button> */}

                        <div>
                            <label className="font-medium mb-2">Blog Content</label>
                            <div className="mt-2 h-400px">
                                <JoditEditor ref={editor} value={content} onChange={newContent => setContent(newContent)} />
                                <div
                                    dangerouslySetInnerHTML={{ __html: content }}
                                    style={{ marginTop: '10px', border: '1px solid #ddd', padding: '10px', borderRadius: '5px', display: 'none' }}
                                ></div>
                            </div>
                        </div>

                        <button
                            type='submit'
                            className="w-full px-4 py-2 text-white font-medium bg-gray-800 hover:bg-gray-700 active:bg-gray-900 rounded-lg duration-150"
                        >
                            Publish Changes
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditBlog;
