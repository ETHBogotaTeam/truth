const Logo = () => {
    return (
        <svg
            width="31"
            height="28"
            viewBox="0 0 31 28"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <g filter="url(#filter0_d_1_363)">
                <path
                    d="M7.25758 2.13116C7.92429 1.2345 8.93567 0.657584 10.0468 0.540082L14.7335 0.0444811C15.0132 0.0149095 15.2952 0.0149096 15.5748 0.0444813L20.2615 0.540081C21.3727 0.657584 22.384 1.2345 23.0508 2.13116L25.3993 5.28974C26.5155 6.79079 26.4423 8.86492 25.2231 10.2836L18.1878 18.47C16.5918 20.3272 13.7166 20.3272 12.1205 18.47L5.08524 10.2836C3.86608 8.86492 3.79288 6.79079 4.909 5.28973L7.25758 2.13116Z"
                    fill="url(#paint0_radial_1_363)"
                />
                <path
                    d="M7.65882 2.4295C8.24219 1.64493 9.12714 1.14012 10.0994 1.03731L14.7861 0.541709C15.0308 0.515834 15.2776 0.515834 15.5222 0.541709L20.2089 1.03731C21.1812 1.14012 22.0661 1.64493 22.6495 2.4295L24.9981 5.58808C25.9747 6.9015 25.9107 8.71636 24.8439 9.95767L17.8086 18.1441C16.4121 19.7691 13.8963 19.7691 12.4997 18.1441L5.46445 9.95767C4.39768 8.71636 4.33364 6.9015 5.31024 5.58807L7.65882 2.4295Z"
                    stroke="white"
                />
            </g>
            <defs>
                <filter
                    id="filter0_d_1_363"
                    x="0.118896"
                    y="0.0223083"
                    width="30.0705"
                    height="27.8406"
                    filterUnits="userSpaceOnUse"
                    colorInterpolationFilters="sRGB"
                >
                    <feFlood floodOpacity="0" result="BackgroundImageFix" />
                    <feColorMatrix
                        in="SourceAlpha"
                        type="matrix"
                        values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                        result="hardAlpha"
                    />
                    <feOffset dy="4" />
                    <feGaussianBlur stdDeviation="2" />
                    <feComposite in2="hardAlpha" operator="out" />
                    <feColorMatrix
                        type="matrix"
                        values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
                    />
                    <feBlend
                        mode="normal"
                        in2="BackgroundImageFix"
                        result="effect1_dropShadow_1_363"
                    />
                    <feBlend
                        mode="normal"
                        in="SourceGraphic"
                        in2="effect1_dropShadow_1_363"
                        result="shape"
                    />
                </filter>
                <radialGradient
                    id="paint0_radial_1_363"
                    cx="0"
                    cy="0"
                    r="1"
                    gradientUnits="userSpaceOnUse"
                    gradientTransform="translate(15.1542 11) rotate(90) scale(11 12.1542)"
                >
                    <stop stopColor="#004A7C" />
                    <stop offset="1" stopColor="white" />
                </radialGradient>
            </defs>
        </svg>
    )
}

export default Logo
