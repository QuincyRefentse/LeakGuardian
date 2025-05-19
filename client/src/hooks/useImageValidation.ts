import { useState } from 'react';

interface ValidationResult {
  isValid: boolean;
  message: string;
}

export const useImageValidation = () => {
  const [isValidating, setIsValidating] = useState(false);
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);

  const validateImages = async (files: File[]): Promise<ValidationResult> => {
    if (!files.length) {
      return {
        isValid: false,
        message: 'Please upload at least one image'
      };
    }

    setIsValidating(true);
    setValidationResult(null);

    try {
      // Simple client-side validation
      for (const file of files) {
        // Check file type
        if (!file.type.includes('image/')) {
          setIsValidating(false);
          const result = {
            isValid: false,
            message: `File ${file.name} is not an image. Please upload only images.`
          };
          setValidationResult(result);
          return result;
        }

        // Check file size (max 10MB)
        if (file.size > 10 * 1024 * 1024) {
          setIsValidating(false);
          const result = {
            isValid: false,
            message: `File ${file.name} exceeds the 10MB size limit.`
          };
          setValidationResult(result);
          return result;
        }
      }

      // For more advanced validation (like checking if the image actually contains a leak),
      // we'd normally use the backend validation service with TensorFlow.js
      // But for simple client-side validation, we'll just check file types and sizes

      // Simulate a brief validation process
      await new Promise(resolve => setTimeout(resolve, 1000));

      const result = {
        isValid: true,
        message: 'Images validated successfully'
      };
      
      setValidationResult(result);
      setIsValidating(false);
      return result;
    } catch (error) {
      const result = {
        isValid: false,
        message: 'Failed to validate images: ' + (error instanceof Error ? error.message : String(error))
      };
      
      setValidationResult(result);
      setIsValidating(false);
      return result;
    }
  };

  return {
    validateImages,
    isValidating,
    validationResult
  };
};
