"use client"
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { myAppHook } from "@/context/AppProvider";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
import Swal from "sweetalert2";


interface ProductType {
    id?: number
    title: string;
    description: string;
    const: number;
    file?: string;
    banner_image?: File | null;
}


const Dashboard: React.FC = () => {
    const {isLoading, authToken} = myAppHook();
    const router = useRouter();
    const fileRef = useRef<HTMLInputElement>(null)
    const [products, setProducts] = useState<ProductType[]>([])
    const [formData, setFormData] = useState<ProductType>({
        title: "",
        description: "",
        const: 0,
        file: "",
        banner_image: null,
    })

    const fetchAllProducts = async() => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/products`, {
                headers: {
                    Authorization: `Bearer ${authToken}`
                }                
            })
            setProducts(response.data.prodcuts)
            console.log(response)
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {
        if (!authToken) {
            router.push('/auth')
            return
        }
        fetchAllProducts()
    }, [authToken, formData ])
    const handleOnChangeEvent = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFormData({
                ...formData,
                banner_image: e.target.files[0],
                file: URL.createObjectURL(e.target.files[0])
            })
        } else {
            setFormData({
                ...formData,
                [e.target.name]: e.target.value
            })
        }
    }


    const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        event?.preventDefault();

        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/products`, formData, {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                    "Content-Type": 'multipart/form-data'
                }
            })
            if (response.data.status) {
                toast.success(response.data.message)
                setFormData({
                    title: "",
                    description: "",
                    const: 0,
                    file: "",
                    banner_image: null
                })
                if (fileRef.current) {
                    fileRef.current.value = ""
                }
            }

        } catch (error) {
            console.log(error)
        }
    }
  return (
      <div className="container mt-4">
        <div className="row">
            <div className="col-md-6">
                <div className="card p-4">
                    <h4>Add Product</h4>
                    <form onSubmit={handleFormSubmit}>
                        <input className="form-control mb-2" name="title" placeholder="Title" value={formData.title} required onChange={handleOnChangeEvent} />
                        <input className="form-control mb-2" name="description" value={formData.description} placeholder="Description" required onChange={handleOnChangeEvent} />
                        <input className="form-control mb-2" name="const" placeholder="Cost" type="number" value={formData.const} required onChange={handleOnChangeEvent} />
                        <div className="mb-2">
                            {formData.file && (
                                <Image src={formData.file} alt="Preview" id="bannerPreview" width={100} height={100}  />
                        )}
                        </div>
                        <input className="form-control mb-2" type="file" id="bannerInput" ref={fileRef} onChange={handleOnChangeEvent}/>
                        <button className="btn btn-primary" type="submit">Add Product</button>
                    </form>
                </div>
            </div>

            <div className="col-md-6">
                <table className="table table-bordered">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Title</th>
                            <th>Banner</th>
                            <th>Cost</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                          {
                              products.map((product, index) => (
                                
                                <tr key={product.id}>
                                      <td>{product.id}</td>
                                    <td>{product.title}</td>
                                    <td>
                                        {product.banner_image ? (
                                            <Image src={product.banner_image} width={50} height={50} alt="Product" />
                                        ) : "No Image"}
                                    </td>
                                      <td>{product.const}</td>
                                    <td>
                                          <button className="btn btn-warning btn-sm me-2" onClick={() => {
                                              setFormData({
                                                  id: product.id,
                                                  title: product.title,
                                                  const: product.const,
                                                  description: product.description,
                                                  file: product.banner_image
                                              })
                                        }}>Edit</button>
                                        <button className="btn btn-danger btn-sm">Delete</button>
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

export default Dashboard