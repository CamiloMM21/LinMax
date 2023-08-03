import { Link } from "react-router-dom";

function NoEncontrado() {
  return (
    <div className="flex items-center h-full p-16 bg-bggray text-gray-100">
      <div className="container flex flex-col items-center justify-center px-5 mx-auto my-8">
        <div className="max-w-md text-center">
          <h2 className="mb-8 font-extrabold text-9xl text-gray-600">
            <span className="sr-only">Error</span>404
          </h2>
          <p className="text-2xl font-semibold md:text-3xl">
            Sorry, we couldn't find this page.
          </p>
          <p className="mt-4 mb-8 text-gray-400">
            But dont worry, you can find plenty of other things on our homepage.
          </p>
          <Link
            to="/menu"
            className="bg-red-600  hover:bg-red-700 px-5 py-3 text-sm shadow-sm font-medium tracking-wider text-gray-50 rounded-full hover:shadow-lg "
          >
            Back to homepage
          </Link>
        </div>
      </div>
    </div>
  );
}

export default NoEncontrado;
