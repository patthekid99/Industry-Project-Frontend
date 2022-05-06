// import axios from 'axios';

export default function newListingPage() {

    return (
        <div className="min-h-full py-10 text-center bg-gray-100">
            <h2 className="pb-4">Create new Listing</h2>
            <form className="flex flex-col justify-center items-center">

                <div className="block">
                    <label className="block text-sm font-medium text-blue-gray-900">
                        Project Name: 
                    </label>
                    <input type="text" name="project" placeholder="  Project Name" className="form-control rounded-lg" />
                </div>
                
                <div className="block">
                    <label className="block text-sm font-medium text-blue-gray-900">
                        Street Number: 
                    </label>
                    <input type="text" name="streetNum" placeholder="  Street Number" className="form-control rounded-lg" />
                </div>

                <div className="block">
                    <label className="block text-sm font-medium text-blue-gray-900">
                        Street Name: 
                    </label>
                    <input type="text" name="streetName" placeholder="  Street Name" className="form-control rounded-lg" />
                </div>

                <div className="block">
                    <label className="block text-sm font-medium text-blue-gray-900">
                        City: 
                    </label>
                    <input type="text" name="city" placeholder="  city" className="form-control rounded-lg" />
                </div>

                <div className="block">
                    <label className="block text-sm font-medium text-blue-gray-900">
                        Postal Code:
                    </label>
                    <input type="text" name="postalcode" placeholder="  Postal Code" className="form-control rounded-lg" />
                </div>

                <div class="shrink-0">
                    <img class="h-20 w-20 object-cover rounded" src="https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1361&q=80" alt="Current project" />
                </div>
                <label className="block">
                    <span className="sr-only">Choose Project Image</span>
                    <input type="file" className="form-control block w-full text-sm text-slate-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-full file:border-0
                    file:text-sm file:font-semibold
                    file:bg-violet-50 file:text-violet-700
                    hover:file:bg-violet-100
                    "/>
                </label>
                
                
                
                <input className="btn" type="submit" value="Submit" />
            </form>
        </div>
    );
}


// "streetNum": "string",
//   "streetName": "string",
//   "city": "string",
//   "postalCode": "string",
//   "projectStatus": "string",
//   "projectImage": "string",
//   "projectName": "string",
//   "projectLink": "string",
//   "projectDescription": "string",
//   "created": "2022-05-05T19:54:01.328Z",
//   "expectedCompletion": "2022-05-06"