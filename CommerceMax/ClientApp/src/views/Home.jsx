import React from 'react'
import Signin from '../components/Signin';
import Signup from '../components/Signup';
import { Modal } from "flowbite";

function Home() {
    function ShowSignInModal() {
        try {
            const control = document.getElementById("signInModal");

            const closeButton = document.getElementById("signInModalClose");

            const drawer = new Modal(control);

            // show the drawer
            drawer.show();

            closeButton.addEventListener("click", () => {
                drawer.hide();
            });
        } catch (error) {
            console.log("xd" + error);
        }
    }

    function ShowSignUpModal() {
        try {
            const control = document.getElementById("signUpModal");

            const closeButton = document.getElementById("signUpModalClose");

            const drawer = new Modal(control);

            // show the drawer
            drawer.show();

            closeButton.addEventListener("click", () => {
                drawer.hide();
            });
        } catch (error) {
            console.log("xd" + error);
        }
    }

    const openMenu = () => {
        let menu = document.getElementById('menu');
        if (menu.classList.contains('hidden')) {
            menu.classList.remove('hidden');
        } else {
            menu.classList.add('hidden');
        }
    }

    return (
        <div>
            <nav className="bg-bggray py-5">
                <div className="container mx-auto flex px-36">
                    <div className="flex flex-grow justify-between">
                        <div>
                            <a className="flex text-white text-xl items-center" href="#">
                                <img className="mr-4" src="./img/flor.png" alt="Comemerce Max Logo" width="48" height="45" />
                                Commerce Max
                            </a>
                        </div>
                        <div className="flex lg:hidden">
                            <img src="./img/HamburguerMenu.svg" alt="Hamburguer Menu Icon" onClick={openMenu} />
                        </div>
                        <div id="menu" className="lg:flex hidden items-center absolute lg:relative lg:top-0 top-20 left-0 bg-bggray w-full lg:w-auto py-14 lg:py-0 px-8">
                            <div className="flex flex-col lg:flex-row">
                                <a onClick={ShowSignInModal} className="text-gray-400 hover:text-gray-200 lg:mr-7 mb-8 lg:mb-0" href="#">Sign In</a>
                                <a onClick={ShowSignUpModal} className="text-gray-400 hover:text-gray-200" href="#">Sign Up</a>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
            <div className="bg-bggray py-5 heightscreen">
                <div className="grid grid-rows-1 grid-flow-col gap-5 flex justify-center items-center">
                    <div className="flex items-center flex-col">
                        <img src="./img/flor.png" alt="Commerce Max Icon" />
                        <h1 className="text-white text-8xl text-center">COMMERCE MAX</h1>
                        <div className="mt-14">
                            <button onClick={ShowSignInModal} className="btn mr-8">
                                Sign In
                            </button>
                            <button onClick={ShowSignUpModal} className="btn ml-8">
                                Sign Up
                            </button>
                        </div>
                    </div>
                    <div>
                        <img className="img-fluid" src="../img/Icon.png" alt="Commerce Max Icon" />
                    </div>
                </div>
            </div>
            <Signin />
            <Signup />
        </div>
    )
}

export default Home