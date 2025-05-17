import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import apiService from '@/services/api';

interface Teacher {
  _id: string;
  teacherId: string;
  name: string;
}

interface ClassFormProps {
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

const ClassForm = ({ teachers, onSuccess, onCancel }: ClassFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);
  
  const { 
    register, 
    handleSubmit, 
    formState: { errors },
    reset
  } = useForm<ClassFormInputs>({
    defaultValues: {
      classId: '',
      name: '',
      classTeacher: '',
      roomNo: '',
      status: 'active'
    }
  });
  
  const onSubmit: SubmitHandler<ClassFormInputs> = async (data) => {
    setIsSubmitting(true);
    setFormError(null);
    setFormSuccess(null);
    
    try {
      const response = await apiService.classes.create(data);
      
      if (response.success) {
        setFormSuccess('Class created successfully!');
        reset();
        
        // Notify parent component of success after a delay
        setTimeout(() => {
          onSuccess();
        }, 1500);
      } else {
        setFormError(response.message || response.error || 'Failed to create class');
      }
    } catch (err) {
      console.error('Error creating class:', err);
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
            {...register("classId", { required: "Class ID is required" })}
            className={`w-full border ${errors.classId ? 'border-red-500' : 'border-gray-300'} rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500`}
            placeholder="e.g., C12345"
          />
          {errors.classId && (
            <p className="mt-1 text-xs text-red-600">{errors.classId.message}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Class Name*</label>
          <input
            id="name"
            {...register("name", { required: "Class name is required" })}
            className={`w-full border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500`}
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
            {...register("classTeacher", { required: "Class teacher is required" })}
            className={`w-full border ${errors.classTeacher ? 'border-red-500' : 'border-gray-300'} rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500`}
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
            {...register("roomNo", { required: "Room number is required" })}
            className={`w-full border ${errors.roomNo ? 'border-red-500' : 'border-gray-300'} rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500`}
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
            {...register("status")}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
              Saving...
            </>
          ) : (
            'Save Class'
          )}
        </button>
      </div>
    </form>
  );
};

export default ClassForm;
