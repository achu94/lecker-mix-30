"use client";

import Link from "next/link";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome } from "@fortawesome/free-solid-svg-icons";
import { faInbox } from "@fortawesome/free-solid-svg-icons";
import { faAdd } from "@fortawesome/free-solid-svg-icons";
import { faVideo } from "@fortawesome/free-solid-svg-icons";

export function Dock() {
  const iconsSizeTailwind = "md:text-xl w-8 h-8";

  return (
    <div className="dock">
      <Link href={""}>
        <button className="">
          <FontAwesomeIcon className={iconsSizeTailwind} icon={faHome} />
        </button>
      </Link>

      <Link href={"/shorts"}>
        <button className="">
          <FontAwesomeIcon className={iconsSizeTailwind} icon={faVideo} />
        </button>
      </Link>

      <Link href={"/shorts/add"}>
        <button className="dock-active">
          <FontAwesomeIcon
            className={`${iconsSizeTailwind} bg-secondary p-2 rounded-full`}
            icon={faAdd}
          />
        </button>
      </Link>

      <Link href={"/inbox"}>
        <button className="dock-active">
          <FontAwesomeIcon className={iconsSizeTailwind} icon={faInbox} />
        </button>
      </Link>

      <div className="avatar">
        <div className={`${iconsSizeTailwind} rounded`}>
          <img src="https://img.daisyui.com/images/profile/demo/yellingcat@192.webp" />
        </div>
      </div>
    </div>
  );
}
