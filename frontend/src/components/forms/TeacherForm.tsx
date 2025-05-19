import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import apiService from '@/services/api';

interface Subject {
  _id: string;
  subjectCode: string;
  name: string;
  department?: string;
}

interface TeacherFormProps {
  subjects: Subject[];
  onSuccess: () => void;
  onCancel: () => void;
}

interface TeacherFormInputs {
  teacherId: string;
  name: string;
  email: string;
  department: string;
  subjectIds: string[];
  contact: string;
  status: string;
}

const TeacherForm = ({ subjects, onSuccess, onCancel }: TeacherFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);
  
  const { 
    register, 
    handleSubmit, 
    formState: { errors },
    reset
  } = useForm<TeacherFormInputs>({
    defaultValues: {
      teacherId: '',
      name: '',
      email: '',
      department: '',
      subjectIds: [],
      contact: '',
      status: 'active'
    }
  });
  
  const onSubmit: SubmitHandler<TeacherFormInputs> = async (data) => {
    setIsSubmitting(true);
    setFormError(null);
    setFormSuccess(null);
    
    try {
      const response = await apiService.teachers.create(data);
      
      if (response.success) {
        setFormSuccess('Teacher created successfully!');
        reset();
        
        // Notify parent component of success after a delay
        setTimeout(() => {
          onSuccess();
        }, 1500);
      } else {
        setFormError(response.message || response.error || 'Failed to create teacher');
      }
    } catch (err) {
      console.error('Error creating teacher:', err);
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
          <label htmlFor="teacherId" className="block text-sm font-medium text-gray-700 mb-1">Teacher ID*</label>
          <input
            id="teacherId"
            {...register("teacherId", { required: "Teacher ID is required" })}
            className={`w-full border ${errors.teacherId ? 'border-red-500' : 'border-gray-300'} rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500`}
            placeholder="e.g., T12345"
          />
          {errors.teacherId && (
            <p className="mt-1 text-xs text-red-600">{errors.teacherId.message}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name*</label>
          <input
            id="name"
            {...register("name", { required: "Full name is required" })}
            className={`w-full border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500`}
            placeholder="e.g., John Doe"
          />
          {errors.name && (
            <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email*</label>
          <input
            id="email"
            type="email"
            {...register("email", { 
              required: "Email is required",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Invalid email address"
              }
            })}
            className={`w-full border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500`}
            placeholder="e.g., john.doe@example.com"
          />
          {errors.email && (
            <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1">Department*</label>
          <input
            id="department"
            {...register("department", { required: "Department is required" })}
            className={`w-full border ${errors.department ? 'border-red-500' : 'border-gray-300'} rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500`}
            placeholder="e.g., Mathematics"
          />
          {errors.department && (
            <p className="mt-1 text-xs text-red-600">{errors.department.message}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="subjectIds" className="block text-sm font-medium text-gray-700 mb-1">Subjects*</label>
          <select
            id="subjectIds"
            multiple
            {...register("subjectIds", { 
              required: "At least one subject is required",
              validate: value => value.length > 0 || "At least one subject is required"
            })}
            className={`w-full border ${errors.subjectIds ? 'border-red-500' : 'border-gray-300'} rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[100px]`}
          >
            {subjects.map(subject => (
              <option key={subject._id} value={subject._id}>
                {subject.name} ({subject.subjectCode})
              </option>
            ))}
          </select>
          <p className="mt-1 text-xs text-gray-500">Hold Ctrl/Cmd to select multiple subjects</p>
          {errors.subjectIds && (
            <p className="mt-1 text-xs text-red-600">{errors.subjectIds.message}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="contact" className="block text-sm font-medium text-gray-700 mb-1">Contact Number*</label>
          <input
            id="contact"
            type="tel"
            {...register("contact", { 
              required: "Contact number is required",
              pattern: {
                value: /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/,
                message: "Invalid phone number format"
              }
            })}
            className={`w-full border ${errors.contact ? 'border-red-500' : 'border-gray-300'} rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500`}
            placeholder="e.g., +1 234-567-8910"
          />
          {errors.contact && (
            <p className="mt-1 text-xs text-red-600">{errors.contact.message}</p>
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
            'Save Teacher'
          )}
        </button>
      </div>
    </form>
  );
};

export default TeacherForm;
