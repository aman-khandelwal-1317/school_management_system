import { useState, useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import apiService from '@/services/api';

interface Teacher {
  _id: string;
  teacherId: string;
  name: string;
}

interface ClassData {
  _id: string;
  classId: string;
  name: string;
  classTeacher: string | Teacher;
  roomNo: string;
  status: string;
  students: string[];
  subjects: string[];
}

interface EditClassFormProps {
  classData: ClassData;
  teachers: Teacher[];
  onSuccess: () => void;
  onCancel: () => void;
}

interface ClassFormInputs {
  classId: string;
  name: string;
  classTeacher: string;
  roomNo: string;
  status: string;
}

const EditClassForm = ({ classData, teachers, onSuccess, onCancel }: EditClassFormProps) => {
  // Show loading state if classData is not yet available
  if (!classData) {
    return (
      <div className="p-8 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600 mb-2"></div>
        <p className="text-gray-600">Loading class data...</p>
      </div>
    );
  }
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);
  
  const { 
    register, 
    handleSubmit, 
    formState: { errors },
    reset,
    setValue
  } = useForm<ClassFormInputs>();
  
  // Set form values when classData is available
  useEffect(() => {
    if (classData) {
      reset({
        classId: classData.classId,
        name: classData.name,
        classTeacher: typeof classData.classTeacher === 'string' 
          ? classData.classTeacher 
          : classData.classTeacher?._id || '',
        roomNo: classData.roomNo,
        status: classData.status || 'active'
      });
    }
  }, [classData, reset]);
  
  const onSubmit: SubmitHandler<ClassFormInputs> = async (data) => {
    setIsSubmitting(true);
    setFormError(null);
    setFormSuccess(null);
    
    try {
      const response = await apiService.classes.update(classData._id, data);
      
      if (response.success) {
        setFormSuccess('Class updated successfully!');
        
        // Notify parent component of success after a delay
        setTimeout(() => {
          onSuccess();
        }, 1500);
      } else {
        setFormError(response.message || response.error || 'Failed to update class');
      }
    } catch (err) {
      console.error('Error updating class:', err);
      setFormError('An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="px-6 py-4">
      {formError && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          {formError}
        </div>
      )}
      
      {formSuccess && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md">
          {formSuccess}
        </div>
      )}
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label htmlFor="classId" className="block text-sm font-medium text-gray-700 mb-1">Class ID*</label>
          <input
            id="classId"
            disabled
            className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-100 cursor-not-allowed"
            {...register("classId", { required: "Class ID is required" })}
          />
          {errors.classId && (
            <p className="mt-1 text-xs text-red-600">{errors.classId.message}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Class Name*</label>
          <input
            id="name"
            className={`w-full border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500`}
            {...register("name", { required: "Class name is required" })}
            placeholder="e.g., Class 10A"
          />
          {errors.name && (
            <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="classTeacher" className="block text-sm font-medium text-gray-700 mb-1">Class Teacher*</label>
          <select
            id="classTeacher"
            className={`w-full border ${errors.classTeacher ? 'border-red-500' : 'border-gray-300'} rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500`}
            {...register("classTeacher", { required: "Class teacher is required" })}
          >
            <option value="">Select Teacher</option>
            {teachers.map(teacher => (
              <option key={teacher._id} value={teacher._id}>{teacher.name}</option>
            ))}
          </select>
          {errors.classTeacher && (
            <p className="mt-1 text-xs text-red-600">{errors.classTeacher.message}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="roomNo" className="block text-sm font-medium text-gray-700 mb-1">Room Number*</label>
          <input
            id="roomNo"
            className={`w-full border ${errors.roomNo ? 'border-red-500' : 'border-gray-300'} rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500`}
            {...register("roomNo", { required: "Room number is required" })}
            placeholder="e.g., R101"
          />
          {errors.roomNo && (
            <p className="mt-1 text-xs text-red-600">{errors.roomNo.message}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select
            id="status"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            {...register("status")}
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>
      
      <div className="flex justify-end space-x-3 border-t border-gray-200 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-md flex items-center"
        >
          {isSubmitting ? (
            <>
              <div className="inline-block animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
              Updating...
            </>
          ) : (
            'Update Class'
          )}
        </button>
      </div>
    </form>
  );
};

export default EditClassForm;
