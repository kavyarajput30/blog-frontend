import React from "react";
import { Button } from "flowbite-react";
function CallToAction() {
  return (
    <div className="flex flex-col sm:flex-row p-3 border border-teal-500 justify-center items-center rounded-tl-3xl rounded-br-3xl text-center m-3">
      <div className="flex-1 justify-center flex flex-col">
        <h2 className="text-2xl">Want to learn more about javascript?</h2>
        <p className="text-gray-500 my-2">
          Checkout these resourses with 35+ projects
        </p>
        <Button
          gradientDuoTone="purpleToPink"
          className=" rounded-bl-none"
        >
          <a
            href="https://github.com/kavyarajput30?tab=repositories"
            target="_blank"
            rel="noreferrer noopener"
          >
            30+ Javascript Projects
          </a>
        </Button>
      </div>
      <div className="p-7 flex-1">
        <img
          src="https://www.educative.io/api/page/5429180235776000/image/download/5343340281200640"
          alt=""
        />
      </div>
    </div>
  );
}

export default CallToAction;
