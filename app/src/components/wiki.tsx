const Wiki: React.FC = () => {
  return (
    <div className="flex-grow bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-md p-8">
        <h2 className="text-3xl font-bold mb-6 text-gray-800">Supported Operations:</h2>
        <div className="grid grid-cols-2 gap-x-12 gap-y-4 text-lg font-mono mb-12">
          <div className="flex justify-between">
            <span className="text-gray-700">Project -&gt;</span>
            <span className="text-gray-900 font-semibold">{'project_ {attrs} Relation'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-700">Natural Join -&gt;</span>
            <span className="text-gray-900 font-semibold">Relation1 * Relation2</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-700">Intersect -&gt;</span>
            <span className="text-gray-900 font-semibold">Relation1 ^ Relation2</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-700">Set subtraction -&gt;</span>
            <span className="text-gray-900 font-semibold">Relation1 - Relation2</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-700">select -&gt;</span>
            <span className="text-gray-900 font-semibold">{'select_ {attrs} Relation'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-700">Cartesian Product </span>
            <span className="text-gray-900 font-semibold">Relation1 X Relation2</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-700">Project All Attrs </span>
            <span className="text-gray-900 font-semibold">Relation</span>
          </div>
        </div>

        <h2 className="text-3xl font-bold mb-6 text-gray-800 mt-8">Sample Queries:</h2>
        
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-3 text-gray-700">Query: Courses</h3>
          <div className="bg-gray-50 p-4 rounded border border-gray-200 overflow-x-auto">
            <pre className="text-sm font-mono whitespace-pre">
{`CourseID  Name             Credits
CS1100    CS1              4      
MATH1100  CALC 1           4      
CS1200    DATA STRUCTURES  4`}
            </pre>
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-3 text-gray-700">Query: Courses X CS_Students</h3>
          <div className="bg-gray-50 p-4 rounded border border-gray-200 overflow-x-auto">
            <pre className="text-sm font-mono whitespace-pre">
{`CourseID  Courses.Name     Credits  StudentID  CS_Students.Name  Age  Enrolled     
CS1100    CS1              4        CS001      Alice             20   CS1, DS      
CS1100    CS1              4        CS002      Charlie           19   CS1, Calc, DS
CS1100    CS1              4        CS003      Eve               21   DS           
MATH1100  CALC 1           4        CS001      Alice             20   CS1, DS      
MATH1100  CALC 1           4        CS002      Charlie           19   CS1, Calc, DS
MATH1100  CALC 1           4        CS003      Eve               21   DS           
CS1200    DATA STRUCTURES  4        CS001      Alice             20   CS1, DS      
CS1200    DATA STRUCTURES  4        CS002      Charlie           19   CS1, Calc, DS
CS1200    DATA STRUCTURES  4        CS003      Eve               21   DS`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Wiki;
