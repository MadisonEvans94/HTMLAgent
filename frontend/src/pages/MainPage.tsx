
const MainPage = () => {
	return (
		<div className='bg-gray-600 w-screen h-screen overscroll-y-contain flex'>
			<GeneratedComponentPane/>
			<div className='bg-blue-500 w-1/4'>asdf</div>
		</div>
	);
};



export default MainPage

const GeneratedComponentPane = () => {
    return <div className='bg-green-300 grow flex items-center justify-center'>component goes here</div>;
}
