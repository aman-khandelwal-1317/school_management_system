import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import apiService from '@/services/api';

interface Class {
  _id: string;
  classId: string;
  name: string;
}

interface SubjectFormProps {
  classes: Class[];
  onSuccess: () => void;
  onCancel: () => void;
}

interface SubjectFormInputs {
  subjectCode: string;
  name: string;
  department: string;
  type: 'Theory' | 'Practical';
  classId: string;
  status: string;
}

const SubjectForm = ({ classes, onSuccess, onCancel }: SubjectFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);
  
  const { 
    register, 
    handleSubmit, 
    formState: { errors },
    reset
  } = useForm<SubjectFormInputs>({
    defaultValues: {
      subjectCode: '',
      name: '',
      department: '',
      type: 'Theory',
      classId: '',
      status: 'active'
    }
  });
  
  const onSubmit: SubmitHandler<SubjectFormInputs> = async (data) => {
    setIsSubmitting(true);
    setFormError(null);
    setFormSuccess(null);
    
    try {
      const response = await apiService.subjects.create(data);
      
      if (response.success) {
        setFormSuccess('Subject created successfully!');
        reset();
        
        // Notify parent component of success after a delay
        setTimeout(() => {
          onSuccess();
        }, 1500);
      } else {
        setFormError(response.message || response.error || 'Failed to create subject');
      }
    } catch (err) {
      console.error('Error creating subject:', err);
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
          <label htmlFor="subjectCode" className="block text-sm font-medium text-gray-700 mb-1">Subject Code*</label>
          <input
            id="subjectCode"
            {...register("subjectCode", { required: "Subject code is required" })}
            className={`w-full border ${errors.subjectCode ? 'border-red-500' : 'border-gray-300'} rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500`}
            placeholder="e.g., MATH101"
          />
          {errors.subjectCode && (
            <p className="mt-1 text-xs text-red-600">{errors.subjectCode.message}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Subject Name*</label>
          <input
            id="name"
            {...register("name", { required: "Subject name is required" })}
            className={`w-full border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500`}
            placeholder="e.g., Mathematics"
          />
          {errors.name && (
            <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1">Department*</label>
          <input
            id="department"
            {...register("department", { required: "Department is required" })}
            className={`w-full border ${errors.department ? 'border-red-500' : 'border-gray-300'} rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500`}
            placeholder="e.g., Science"
          />
          {errors.department && (
            <p className="mt-1 text-xs text-red-600">{errors.department.message}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">Subject Type*</label>
          <select
            id="type"
            {...register("type", { required: "Subject type is required" })}
            className={`w-full border ${errors.type ? 'border-red-500' : 'border-gray-300'} rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500`}
          >
            <option value="Theory">Theory</option>
            <option value="Practical">Practical</option>
          </select>
          {errors.type && (
            <p className="mt-1 text-xs text-red-600">{errors.type.message}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="classId" className="block text-sm font-medium text-gray-700 mb-1">Class*</label>
          <select
            id="classId"
            {...register("classId", { required: "Class is required" })}
            className={`w-full border ${errors.classId ? 'border-red-500' : 'border-gray-300'} rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500`}
          >
            <option value="">Select Class</option>
            {classes.map(cls => (
              <option key={cls._id} value={cls._id}>{cls.name}</option>
            ))}
          </select>
          {errors.classId && (
            <p className="mt-1 text-xs text-red-600">{errors.classId.message}</p>
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
            'Save Subject'
          )}
        </button>
      </div>
    </form>
  );
};

export default SubjectForm;
