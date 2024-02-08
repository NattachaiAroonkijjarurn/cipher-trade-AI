import React from 'react';

import "../layouts/layoutsCss/Support.css"

const Support = () => {
  return (
    <div className="site-container bordered">
      <div className="w-full">
        <div className="bg-grid border-b-1 border-gray-300 dark:border-gray-700 lg:grid lg:grid-cols-16 lg:grid-rows-8 lg:bg-grid-gray-300 lg:dark:bg-grid-gray-700">
          {/* Green Section */}
          <div className="col-span-7 row-span-8 flex flex-col justify-between gap-32 bg-green-500 px-15 py-32 text-gray-100 dark:bg-green-400 dark:text-gray-900">
            <h1 className="max-w-[600px] typography text-heading-lg font-roobert">
              We build accessible and reliable cloud infrastructure.
            </h1>
            <div className="flex max-w-[420px] flex-col gap-30">
              <div className="typography text-body-xl font-montreal">
                <p>Render helps software teams ship products fast and at any scale...</p>
              </div>
            </div>
          </div>

          {/* Image Section */}
          <div className="relative w-full overflow-hidden lg:col-span-6 lg:col-start-11 lg:row-span-7">
            <img
              alt=""
              loading="lazy"
              decoding="async"
              data-nimg="fill"
              src="https://cdn.sanity.io/images/hvk0tap5/production/05dd05aa7f84df7fa465fd67c666f15735225834-2160x2516.jpg?w=1600&fit=max&auto=format"
              style={{ position: 'absolute', height: '100%', width: '100%', inset: '0px', objectFit: 'cover', color: 'transparent' }}
            />
          </div>
        </div>

        {/* Our Team Section */}
        <div className="pt-15 lg:py-[54px] lg:pt-[54px]">
          <div className="lg:grid lg:grid-cols-16 lg:grid-rows-8">
            <div className="flex flex-col justify-center gap-30 p-15 lg:col-span-6 lg:col-start-2 lg:row-span-6 lg:row-start-2 lg:gap-90">
              <div className="typography text-heading-lg font-roobert">Our Team</div>
              <div className="flex max-w-[420px] flex-col gap-30 md:max-w-[550px] xl:max-w-[420px]">
                <div className="typography text-body-lg font-montreal">
                  <p>Render is headquartered in San Francisco, California, with remote team members...</p>
                </div>
                {/* Button with dynamic background animation */}
                <a className="ease group relative z-[1] flex cursor-pointer items-center justify-between overflow-hidden font-montreal transition-colors motion-safe:duration-150 motion-reduce:duration-0 motion-safe:lg:duration-300 buttonStyles text-body-md py-10 px-15 gap-15 bg-transparent text-gray-900 dark:text-gray-100 border-1 border-gray-900 dark:border-gray-100 active:hover:text-gray-100 lg:hover:text-gray-100 dark:active:text-gray-900 dark:lg:hover:text-gray-900 self-start" href="/careers#open-roles">
                  <span className="buttonBackground bg-gray-900 dark:bg-gray-100"></span>
                  <span className="relative z-[1] inline-block translate-x-0 transition-transform">Explore Open Roles</span>
                  {/* SVG Arrow */}
                  <svg className="arrowStyles w-15 h-15 transform rotate-90" xmlns="http://www.w3.org/2000/svg" fill="none">
                    {/* SVG content */}
                  </svg>
                </a>
              </div>
            </div>
            {/* More sections can continue here */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Support;