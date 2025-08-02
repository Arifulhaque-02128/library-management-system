'use client'

import { cn } from "@/lib/utils";
import {
  ImageKitAbortError,
  ImageKitInvalidRequestError,
  ImageKitProvider,
  ImageKitServerError,
  ImageKitUploadNetworkError,
  upload,
} from "@imagekit/next";
import Image from "next/image";
import { useRef, useState } from "react";
import toast from "react-hot-toast";

const publicKey = process.env.IMAGEKIT_PUBLIC_KEY!;
const urlEndpoint = process.env.IMAGEKIT_URL_ENDPOINT!;

interface FileUploadProps {
  setValue: (name: string, value: any) => void;
  isFieldRequired : boolean,
  value : string
}

const FileUpload = ({setValue, isFieldRequired, value} : FileUploadProps ) => {
  const [progress, setProgress] = useState(0);
  const [filePath, setFilePath] = useState<File | null>(null);
  const [hostedImg, setHostedImg] = useState<any>(value);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const abortController = new AbortController();

  const authenticator = async () => {
    try {
      const response = await fetch("/api/imagekit-auth");
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Request failed: ${errorText}`);
      }

      const data = await response.json();
      const { signature, expire, token, publicKey } = data;
      return { signature, expire, token, publicKey };
    } catch (error) {
      console.error("Authentication error:", error);
      throw new Error("Authentication request failed");
    }
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Size check: 2MB = 2 * 1024 * 1024 bytes
    if (file.size > 2 * 1024 * 1024) {
      toast.error("File size must be less than or equal to 2MB");
      return;
    }

    setFilePath(file);

    let authParams;
    try {
      authParams = await authenticator();
    } catch (authError) {
      console.error("Failed to authenticate:", authError);
      toast.error("Authentication failed. Try again.");
      return;
    }

    const { signature, expire, token, publicKey } = authParams;

    try {
      const uploadResponse = await upload({
        expire,
        token,
        signature,
        publicKey,
        file,
        fileName: file.name,
        onProgress: (event) => {
          setProgress(Math.round((event.loaded / event.total) * 100));
        },
        abortSignal: abortController.signal,
      });

      setHostedImg(uploadResponse?.url);
      setValue("coverUrl", uploadResponse?.url);
      toast.success("Upload successful!");
    } catch (error) {
      if (error instanceof ImageKitAbortError) {
        toast.error("Upload aborted");
      } else if (error instanceof ImageKitInvalidRequestError) {
        toast.error("Invalid upload request");
      } else if (error instanceof ImageKitUploadNetworkError) {
        toast.error("Network error during upload");
      } else if (error instanceof ImageKitServerError) {
        toast.error("Server error");
      } else {
        toast.error("Unknown error during upload");
      }
      console.error("Upload error:", error);
    }
  };

  return (
    <ImageKitProvider
      // @ts-ignore
      publicKey={publicKey}
      urlEndpoint={urlEndpoint}
      authenticator={authenticator}
    >
      <input
        type="file"
        ref={fileInputRef}
        hidden
        accept="image/*"
        onChange={handleFileChange}
        required={isFieldRequired}
      />

      <button
        type="button"
        className={cn("upload-btn flex items-center gap-2 px-4 py-2 bg-light-600 hover:bg-sky-100 border border-gray-300 rounded-md")}
        onClick={() => fileInputRef.current?.click()}
      >
        <Image
          src="/icons/upload.svg"
          alt="upload-icon"
          width={20}
          height={20}
          className="object-contain"
        />
        <p className="text-base text-slate-500">Upload Cover Image</p>
      </button>

      {filePath && (
        <p className="mt-2 text-sm text-gray-600">Selected: {filePath.name}</p>
      )}

      {progress > 0 && progress < 100 && (
        <div className="w-full bg-gray-200 rounded-full mt-4 h-5">
          <div
            className="bg-blue-500 text-white text-xs font-medium text-center p-1 leading-none rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          >
            {progress}%
          </div>
        </div>
      )}

      {hostedImg && (
        <div className="mt-4 flex justify-center">
          <Image
            src={hostedImg}
            width={150}
            height={150}
            alt="Uploaded image"
            className="rounded-md object-contain shadow-md"
          />
        </div>
      )}
    </ImageKitProvider>
  );
};

export default FileUpload;
