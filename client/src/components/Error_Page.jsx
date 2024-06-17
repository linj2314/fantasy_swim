export default function Error_Page() {
    return(
        <>
            <div className="flex flex-col items-center justify-center h-screen">
                <div className="text-5xl pb-5">Error</div>
                <div className="text-3xl pb-5">Page not found</div>
                <div className="text-xl">Maybe check the URL?</div>
            </div>
        </>
    );
}