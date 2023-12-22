import { useState, useEffect, ChangeEvent } from 'react';


const FormResult: React.FC<{

}> = ({

}) => {

        return (
            <>
                <div className='mx-auto max-w-screen-xl px-4 py-16 sm:px-6 lg:px-8'>
                    <article className="overflow-hidden rounded-lg shadow transition hover:shadow-lg flex">
                        <img
                            alt="Office"
                            src="https://images.unsplash.com/photo-1524758631624-e2822e304c36?ixlib=rb-1.2.1&ixid=MnwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80"
                            className="h-56 w-full object-cover w-1/3"
                        />

                        <div className="bg-white p-4 sm:p-6 w-2/3">
                            <a href="#">
                                <h3 className="mt-0.5 text-lg text-gray-900">
                                    How to position your furniture for positivity
                                </h3>
                            </a>

                            <p className="mt-2 line-clamp-3 text-sm/relaxed text-gray-500">
                                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Recusandae
                                dolores, possimus pariatur animi temporibus nesciunt praesentium dolore
                                sed nulla ipsum eveniet corporis quidem, mollitia itaque minus soluta,
                                voluptates neque explicabo tempora nisi culpa eius atque dignissimos.
                                Molestias explicabo corporis voluptatem?
                            </p>
                        </div>
                    </article>
                </div>
            </>
        );
    };



export default FormResult
