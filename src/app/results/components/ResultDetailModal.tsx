import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Result } from '../types';
import { getAnimationConfig, combineAnimations } from '../../../config/animation';

interface ResultDetailModalProps {
  result: Result | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ResultDetailModal({
  result,
  isOpen,
  onClose,
}: ResultDetailModalProps) {
  if (!result) return null;

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          {...getAnimationConfig('fade')}
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              {...getAnimationConfig('scale')}
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl sm:p-6">
                <div>
                  {/* 匹配分数 */}
                  <motion.div 
                    className="text-center mb-8"
                    {...getAnimationConfig('spring')}
                  >
                    <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-pink-100">
                      <span className="text-4xl font-bold text-pink-600">
                        {result.score}%
                      </span>
                    </div>
                    <Dialog.Title as="h3" className="mt-4 text-xl font-semibold text-gray-900">
                      匹配详情
                    </Dialog.Title>
                  </motion.div>

                  {/* 详细分析 */}
                  <motion.div
                    {...getAnimationConfig('slide')}
                    className="mb-6"
                  >
                    <h4 className="font-medium text-gray-900 mb-2">详细分析</h4>
                    <p className="text-gray-600">{result.analysis}</p>
                  </motion.div>

                  {/* 关系建议 */}
                  <motion.div
                    {...getAnimationConfig('list.container')}
                    className="mb-6"
                  >
                    <h4 className="font-medium text-gray-900 mb-2">关系建议</h4>
                    <ul className="space-y-2">
                      {result.suggestions.map((suggestion, index) => (
                        <motion.li
                          key={index}
                          {...getAnimationConfig('list.item')}
                          className="flex items-start"
                        >
                          <span className="flex-shrink-0 w-5 h-5 rounded-full bg-pink-100 flex items-center justify-center mr-2">
                            <span className="text-pink-600 text-sm">{index + 1}</span>
                          </span>
                          <span className="text-gray-600">{suggestion}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </motion.div>

                  {/* 操作按钮 */}
                  <motion.div
                    {...getAnimationConfig('fade')}
                    className="mt-8 border-t pt-6"
                  >
                    <div className="flex justify-center space-x-4">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-pink-600 hover:bg-pink-700"
                        onClick={onClose}
                      >
                        关闭
                      </motion.button>
                    </div>
                  </motion.div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
} 