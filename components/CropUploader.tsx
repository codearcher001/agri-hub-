"use client";

import React, { useState } from "react";

interface CropAnalysisResult {
	cropName: string;
	disease: string;
	fertilizer: string;
}

export default function CropUploader() {
	const [imagePreview, setImagePreview] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [result, setResult] = useState<CropAnalysisResult | null>(null);

	async function toBase64(file: File): Promise<string> {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.onload = () => {
				const base64 = (reader.result as string).split(",")[1] || "";
				resolve(base64);
			};
			reader.onerror = reject;
			reader.readAsDataURL(file);
		});
	}

	async function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
		const file = e.target.files?.[0];
		if (!file) return;
		setError(null);
		setResult(null);
		setLoading(true);
		try {
			const previewUrl = URL.createObjectURL(file);
			setImagePreview(previewUrl);
			const base64 = await toBase64(file);

			const resp = await fetch("http://localhost:5000/api/gemini", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ image: base64 }),
			});
			if (!resp.ok) {
				const data = await resp.json().catch(() => ({}));
				throw new Error(data.error || `Request failed with ${resp.status}`);
			}
			const data: CropAnalysisResult = await resp.json();
			setResult(data);
		} catch (err: any) {
			setError(err?.message || "Something went wrong");
		} finally {
			setLoading(false);
		}
	}

	return (
		<div className="w-full max-w-xl mx-auto space-y-4">
			<input
				type="file"
				accept="image/*"
				onChange={onFileChange}
				className="block w-full text-sm"
			/>

			{imagePreview && (
				<img
					src={imagePreview}
					alt="Preview"
					className="w-full max-h-80 object-contain rounded border"
				/>
			)}

			{loading && <div className="text-sm text-gray-500">Analyzing...</div>}
			{error && (
				<div className="rounded border border-red-300 bg-red-50 p-3 text-red-800 text-sm">
					{error}
				</div>
			)}

			{result && (
				<div className="rounded border p-4 shadow-sm bg-white">
					<h3 className="font-semibold mb-2">Analysis Result</h3>
					<div className="space-y-1 text-sm">
						<div>
							<span className="font-medium">Crop Name:</span> {result.cropName}
						</div>
						<div>
							<span className="font-medium">Disease:</span> {result.disease}
						</div>
						<div>
							<span className="font-medium">Fertilizer:</span> {result.fertilizer}
						</div>
					</div>
				</div>
			)}
		</div>
	);
}