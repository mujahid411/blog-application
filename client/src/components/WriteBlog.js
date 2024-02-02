import React, { useRef, useState } from 'react';
import JoditEditor from 'jodit-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const WriteBlog = () => {
    const editor = useRef(null);
    const [content, setContent] = useState('');
    const [title, setTitle] = useState('');
    const [image, setImage] = useState(null);
    const [imageValue, setImageValue] = useState(false);
    const [imageUrl, setImageUrl] = useState(null);
    const [blogContent, setBlogContent] = useState('');
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
       
        try {
            e.preventDefault();
            var tempDiv = document.createElement("div");
            tempDiv.innerHTML = content;
            console.log(tempDiv.innerText);
            setBlogContent(tempDiv.innerText)
            
            let response = await axios.post('/blog/createBlog', { blogContent, imageUrl, title });
            if (response) {
                navigate('/main')
            }

        } catch (error) {
            console.error(error)
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
            setImageUrl(imageUrl)

            // Display image preview
            //   const reader = new FileReader();
            //   reader.onload = (event) => {
            //     setImageUrl(event.target.result);
            //   };
            //   reader.readAsDataURL(e.target.files[0]);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="w-full relative z-10 text-gray-600 ">
            <center className="text-2xl font-bold mt-10">Create Blog {blogContent}</center>
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

                    <div>
                        <label className="font-medium mb-2">Blog Content</label>
                        <div className="mt-2">
                            <JoditEditor ref={editor} value={content} onChange={(newContent) => setContent(newContent)} />
                            <div
                                dangerouslySetInnerHTML={{ __html: content }}
                                onBlur={() => setBlogContent(content)}
                                style={{ marginTop: '10px', border: '1px solid #ddd', padding: '10px', borderRadius: '5px', display: 'none' }}
                            ></div>
                        </div>
                    </div>

                    <button
                        className="w-full px-4 py-2 text-white font-medium bg-gray-800 hover:bg-gray-700 active:bg-gray-900 rounded-lg duration-150"
                    >
                        Publish
                    </button>
                </form>
            </div>
        </div>
    );
};

export default WriteBlog;
