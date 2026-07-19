import React, { useState, useRef, useEffect } from "react"
import { Modal, IconButton, Box, Backdrop, Typography } from "@mui/material"
import CloseIcon from "@mui/icons-material/Close"
import FullscreenIcon from "@mui/icons-material/Fullscreen"
import { useI18n } from "../i18n"

const Certificate = ({ ImgSertif }) => {
	const { t } = useI18n()
	const [open, setOpen] = useState(false)
	const [loaded, setLoaded] = useState(false)
	const [modalLoaded, setModalLoaded] = useState(false)
	const imgRef = useRef(null)

	const handleOpen = () => {
		setModalLoaded(false)
		setOpen(true)
	}

	const handleClose = () => {
		setOpen(false)
	}

	useEffect(() => {
		const img = imgRef.current
		if (!img) return

		if (img.complete && img.naturalWidth > 0) {
			setLoaded(true)
			return
		}

		const onLoad = () => setLoaded(true)
		img.addEventListener("load", onLoad)
		return () => img.removeEventListener("load", onLoad)
	}, [])

	return (
		<Box component="div" sx={{ width: "100%" }}>
			{/* Thumbnail Container */}
			<Box
				sx={{
					position: "relative",
					overflow: "hidden",
					borderRadius: 2,
					boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
					transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
					"&:hover": {
						transform: "translateY(-5px)",
						boxShadow: "0 12px 24px rgba(0,0,0,0.2)",
						"& .overlay": {
							opacity: 1,
						},
						"& .hover-content": {
							transform: "translate(-50%, -50%)",
							opacity: 1,
						},
						"& .certificate-image": {
							filter: "contrast(1.05) brightness(0.3) saturate(1.1) blur(2px)",
						},
					},
				}}>
				{/* Loading State - Spinner + Blur */}
				<Box
					sx={{
						position: "absolute",
						inset: 0,
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						zIndex: 1,
						opacity: loaded ? 0 : 1,
						transition: "opacity 0.4s ease",
						pointerEvents: loaded ? "none" : "auto",
						backdropFilter: "blur(12px)",
						backgroundColor: "rgba(0, 0, 0, 0.15)",
					}}>
					<Box
						sx={{
							width: 40,
							height: 40,
							border: "3px solid rgba(139, 92, 246, 0.2)",
							borderTop: "3px solid #8b5cf6",
							borderRadius: "50%",
							animation: "spin 0.8s linear infinite",
							"@keyframes spin": {
								from: { transform: "rotate(0deg)" },
								to: { transform: "rotate(360deg)" },
							},
						}}
					/>
				</Box>

				{/* Certificate Image with Initial Filter */}
				<Box
					sx={{
						position: "relative",
						"&::before": {
							content: '""',
							position: "absolute",
							top: 0,
							insetInlineStart: 0,
							insetInlineEnd: 0,
							bottom: 0,
							backgroundColor: "rgba(0, 0, 0, 0.1)",
							zIndex: 2,
							pointerEvents: "none",
						},
					}}>
					<img
						ref={imgRef}
						className="certificate-image"
						src={ImgSertif}
						alt={t("certificate.alt")}
						loading="lazy"
						decoding="async"
						style={{
							width: "100%",
							height: "auto",
							display: "block",
							objectFit: "cover",
							filter: loaded
								? "contrast(1.10) brightness(0.9) saturate(1.1)"
								: "contrast(1.10) brightness(0.9) saturate(1.1) blur(10px)",
							transition: "filter 0.5s ease",
							aspectRatio: "16/11.5",
						}}
						onClick={handleOpen}
					/>
				</Box>

				{/* Hover Overlay */}
				<Box
					className="overlay"
					sx={{
						position: "absolute",
						top: 0,
						insetInlineStart: 0,
						insetInlineEnd: 0,
						bottom: 0,
						backgroundColor: "rgba(0, 0, 0, 0.6)",
						opacity: 0,
						transition: "all 0.3s ease",
						cursor: "pointer",
						zIndex: 3,
					}}
					onClick={handleOpen}>
					{/* Hover Content */}
					<Box
						className="hover-content"
						sx={{
							position: "absolute",
							top: "50%",
							insetInlineStart: "50%",
							transform: "translate(-50%, -60%)",
							opacity: 0,
							transition: "all 0.4s ease",
							textAlign: "center",
							width: "100%",
							color: "white",
						}}>
						<FullscreenIcon
							sx={{
								fontSize: 40,
								mb: 1,
								filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.2))",
							}}
						/>
						<Typography
							variant="h6"
							sx={{
								fontWeight: 600,
								textShadow: "0 2px 4px rgba(0,0,0,0.3)",
							}}>
							{t("certificate.view")}
						</Typography>
					</Box>
				</Box>
			</Box>

			{/* Modal */}
			<Modal
				open={open}
				onClose={handleClose}
				aria-labelledby="modal-modal-title"
				aria-describedby="modal-modal-description"
				slots={{ backdrop: Backdrop }}
				slotProps={{
					backdrop: {
						timeout: 300,
						sx: {
							backgroundColor: "rgba(0, 0, 0, 0.9)",
							backdropFilter: "blur(5px)",
						},
					},
				}}
				sx={{
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					margin: 0,
					padding: 0,
				}}>
				<Box
					sx={{
						position: "relative",
						width: "auto",
						maxWidth: "90vw",
						maxHeight: "90vh",
						m: 0,
						p: 0,
						outline: "none",
						"&:focus": {
							outline: "none",
						},
					}}>
					{/* Close Button */}
					<IconButton
						onClick={handleClose}
						sx={{
							position: "absolute",
							insetInlineEnd: 16,
							top: 16,
							color: "white",
							bgcolor: "rgba(0,0,0,0.6)",
							zIndex: 1,
							padding: 1,
							"&:hover": {
								bgcolor: "rgba(0,0,0,0.8)",
								transform: "scale(1.1)",
							},
						}}
						size="large">
						<CloseIcon sx={{ fontSize: 24 }} />
					</IconButton>

					{/* Modal Loading Spinner */}
					{!modalLoaded && (
						<Box
							sx={{
								position: "absolute",
								inset: 0,
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
								backdropFilter: "blur(8px)",
								backgroundColor: "rgba(0, 0, 0, 0.3)",
								borderRadius: 2,
							}}>
							<Box
								sx={{
									width: 48,
									height: 48,
									border: "3px solid rgba(255, 255, 255, 0.2)",
									borderTop: "3px solid white",
									borderRadius: "50%",
									animation: "spin 0.8s linear infinite",
									"@keyframes spin": {
										from: { transform: "rotate(0deg)" },
										to: { transform: "rotate(360deg)" },
									},
								}}
							/>
						</Box>
					)}

					{/* Modal Image */}
					<img
						src={ImgSertif}
						alt={t("certificate.fullAlt")}
						decoding="async"
						onLoad={() => setModalLoaded(true)}
						style={{
							display: "block",
							maxWidth: "100%",
							maxHeight: "90vh",
							margin: "0 auto",
							objectFit: "contain",
							opacity: modalLoaded ? 1 : 0,
							transition: "opacity 0.3s ease",
						}}
					/>
				</Box>
			</Modal>
		</Box>
	)
}

export default Certificate
